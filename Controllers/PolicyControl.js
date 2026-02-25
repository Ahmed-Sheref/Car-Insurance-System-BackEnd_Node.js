import { poolPromise } from '../Models/db.js';
import sql from 'mssql';
import { sendEmail } from '../utils/email.js';

export async function policy_request(req , res , next) 
{
    const {car_id , coverage_type , start_date , end_date} = req.body;
    const customer_id = req.customer_id;

    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    try
    {
        const pool = await poolPromise;
        const request = new sql.Request(pool);
        // check if the car_id is valid
        const car = await request
            .input('car_id', sql.Int, car_id).query('SELECT * FROM dbo.Car WHERE car_id = @car_id');
        if (car.recordset.length === 0)
        {
            return res.status(400).json({status: 'error', message: 'Car not found'});
        }

        const existPolicy = await request.input('start_date', sql.Date, start_date).query(`select * from PolicyRequest where car_id = @car_id
                                            and end_date >= @start_date`);

        if (existPolicy.recordset.length > 0) 
        {
            const existing = existPolicy.recordset[0];
            
            if (existing.status === 'pending') 
            {
                return res.status(400).json(
                {
                    status: 'error',
                    message: 'There is already a pending insurance request for this car. Please wait for approval.'
                });
            }

            if (existing.status === 'approved') 
            {
                const expiryDate = existing.end_date.toISOString().split('T')[0];
                return res.status(400).json(
                {
                    status: 'error', 
                    message: `This car has an active policy until ${expiryDate}. You cannot add a new one until the current one expires.`
                });
            }
        }
        // check from dates
        if (startDateObj >= endDateObj)
        {
            return res.status(400).json({status: 'error', message: 'Start date must be before end date'});
        }


        // calc Proposed premium
        /**
         * أبسط معادلة مفهومة:

            مدة التأمين بالأيام
            days = end_date - start_date

            Base rate حسب coverage_type:

            ThirdParty = 1.0

            Full = 1.4

            Factor حسب عمر العربية
            age = currentYear - car.year

            لو age <= 3 → factor = 1.2

            لو age بين 4 و 10 → factor = 1.0

            لو > 10 → factor = 0.9

            Premium
            مثلاً:
            premium = (days / 365) * 1000 * coverageRate * ageFactor

            1000 هنا “base price سنوي” تقدر تغيّره.
         */
        
        let diffInMs = endDateObj - startDateObj;
        let days = diffInMs / (1000 * 60 * 60 * 24);
        let coverageRate = (coverage_type === 'ThirdParty' ? 1.0 : 1.4);
        let age = new Date().getFullYear() - car.year;
        let ageFactor = (age <= 3 ? 1.2 : (age >= 4 && age <= 10 ? 1.0 : 0.9));
        let premium = (days / 365) * 1000 * coverageRate * ageFactor;

        // save to database
        // insert PolicyRequest
        const result = await request
            .input('coverage_type', sql.VarChar(50), coverage_type)
            .input('end_date', sql.Date, end_date)
            .input('premium', sql.Float, premium)
            .input('requested_at', sql.DateTime, new Date())
            .query(`
                INSERT INTO dbo.PolicyRequest 
                (car_id, coverage_type, start_date, end_date, proposed_premium, requested_at, status) 
                OUTPUT INSERTED.request_id
                VALUES 
                (@car_id, @coverage_type, @start_date, @end_date, @premium, @requested_at, 'pending')
            `);
        if (result.recordset.length === 0)
        {
            return res.status(400).json({status: 'error', message: 'Failed to save policy request'});
        }

        res.status(201).json(
        {
            status: 'success',
            request: 
            {
                request_id: result.recordset[0].request_id,
                car_id: car_id,
                proposed_premium: premium,
                status: 'pending'
            }
        });

    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({status: 'error', message: err.message});
    }
}

export async function get_policy_request(req , res , next)
{
    let customer_id = req.customer_id;
    try
    {
        const pool = await poolPromise;
        const request = new sql.Request(pool);

        // get all policy requests for the customer via joins between PolicyRequest and Car and Customer
        const result = await request
            .input('customer_id', sql.Int, customer_id)
            .query(`
                SELECT pr.*, c.model AS car_model, c.make AS car_make
                FROM dbo.PolicyRequest pr
                JOIN dbo.Car c ON pr.car_id = c.car_id
                WHERE c.customer_id = @customer_id AND pr.status = 'pending'
            `);
        res.status(200).json({status: 'success', data: result.recordset});
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({status: 'error', message: err.message});
    }
}


export async function get_policy_request_by_id(req , res , next)
{
    try
    {
        const req_id = req.params.req_id;
        const pool = await poolPromise;
        const request = new sql.Request(pool);
        const result = await request.input('req_id', sql.Int, req_id).query('SELECT * FROM dbo.PolicyRequest WHERE request_id = @req_id');
        res.status(200).json({ status: 'success', message: 'Request fetched successfully', data: {Request: result.recordset} });
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

export async function get_policy_request_admin(req , res, next)
{
    let customer_id = req.customer_id;
    try
    {
        const pool = await poolPromise;
        const request = new sql.Request(pool);

        // get all policy requests for the customer via joins between PolicyRequest and Car and Customer
        let query = `SELECT
                    pr.*,
                    c.model AS car_model,
                    c.make AS car_make,
                    cust.first_name + ' ' + cust.second_name AS customer_full_name,
                    cust.email AS customer_email
                    FROM dbo.PolicyRequest pr
                    JOIN dbo.Car c ON pr.car_id = c.car_id
                    JOIN dbo.Customer cust ON c.customer_id = cust.customer_id
                    WHERE pr.status = 'pending'
                    ORDER BY pr.requested_at DESC;`
        const result = await request
            // .input('customer_id', sql.Int, customer_id)
            .query(query);
        res.status(200).json({status: 'success', data: result.recordset});
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({status: 'error', message: err.message});
    }
}

// approve policy request
/**
* PATCH /policy-requests/:id
* Admin-only: approve/reject بعد ما العميل يعمل apply
* Body:
*  - Approve: { status:'Approved', approved_premium, max_coverage, notes? }
*  - Reject : { status:'Rejected', notes? }
*
* protect لازم يحط: req.user = { employee_id, type:'employee' } للأدمن
*/
export async function approve_policy_request(req, res, next)
{
    const request_id = parseInt(req.params.req_id);
    if (!request_id)
    {
        return res.status(400).json({ message: "Invalid request id" });
    }

    const employee_id = req.customer_id; 
    const { status, approved_premium, max_coverage, notes = null } = req.body || {};

    const normalizedStatus = status ? status.toLowerCase() : "";

    if (!["approved", "rejected"].includes(normalizedStatus)) 
    {
        return res.status(400).json({ message: "status must be Approved or Rejected" });
    }

    let ap = null;
    let mc = null;

    if (normalizedStatus === "approved") 
    {
        ap = Number(approved_premium);
        mc = Number(max_coverage);
        if (!ap || ap <= 0) return res.status(400).json({ message: "approved_premium must be > 0" });
        if (!mc || mc <= 0) return res.status(400).json({ message: "max_coverage must be > 0" });
    }

    
    const pool = await poolPromise;
    const tx = new sql.Transaction(pool);
    try 
    {
        await tx.begin();

        const q1 = new sql.Request(tx);
        const r1 = await q1
            .input("request_id", sql.Int, request_id)
            .query(`
                SELECT car_id, coverage_type, start_date, end_date, status
                FROM dbo.PolicyRequest WITH (UPDLOCK, ROWLOCK)
                WHERE request_id = @request_id;
            `);

        if (r1.recordset.length === 0) 
        {
            await tx.rollback();
            return res.status(404).json({ message: "Policy request not found" });
        }

        const pr = r1.recordset[0];

        if (pr.status.toLowerCase() !== "pending") 
        {
            await tx.rollback();
            return res.status(409).json({ message: `Cannot review. Current status is ${pr.status}` });
        }

        const userData = await new sql.Request(tx)
            .input("car_id", sql.Int, pr.car_id)
            .query(`
                SELECT 
                cust.email,
                cust.first_name
                FROM dbo.Car c
                JOIN dbo.Customer cust ON c.customer_id = cust.customer_id
                WHERE c.car_id = @car_id
            `);

            const customerEmail = userData.recordset[0].email;
            const customerFirstName = userData.recordset[0].first_name;

        if (normalizedStatus === "approved") 
        {
            
            const insRes = await new sql.Request(tx)
                .input("car_id", sql.Int, pr.car_id)
                .input("coverage_type", sql.NVarChar(50), pr.coverage_type)
                .input("start_date", sql.Date, pr.start_date)
                .input("end_date", sql.Date, pr.end_date)
                .input("premium", sql.Decimal(12, 2), ap)
                .input("max_coverage", sql.Decimal(12, 2), mc)
                .input("pstatus", sql.NVarChar(20), "Active")
                .query(`
                    INSERT INTO dbo.Policy (car_id, coverage_type, start_date, end_date, premium, max_coverage, status)
                    OUTPUT INSERTED.policy_id
                    VALUES (@car_id, @coverage_type, @start_date, @end_date, @premium, @max_coverage, @pstatus);
                `);

            const policy_id = insRes.recordset[0].policy_id;

            
            await new sql.Request(tx)
                .input("request_id", sql.Int, request_id)
                .input("employee_id", sql.Int, employee_id)
                .input("approved_premium", sql.Decimal(12, 2), ap)
                .input("max_coverage", sql.Decimal(12, 2), mc)
                .input("notes", sql.NVarChar(500), notes)
                .input("created_policy_id", sql.Int, policy_id)
                .query(`
                    UPDATE dbo.PolicyRequest
                    SET status = 'Approved',
                        approved_premium = @approved_premium,
                        max_coverage = @max_coverage,
                        notes = @notes,
                        approved_by_employee_id = @employee_id,
                        approved_at = SYSUTCDATETIME(),
                        created_policy_id = @created_policy_id
                    WHERE request_id = @request_id;
                `);

            // هتجيبهم ب Query بسيطة
            await tx.commit();
            try 
            {
                await sendEmail(
                {
                    email: customerEmail,
                    subject: "Your insurance request has been approved",
                    template: "policyRequestApproved",
                    user: {
                        name: customerFirstName
                    },
                    url: `policy/${policy_id}`
                });
            } 
            catch (emailErr) 
            {
                console.error("Email failed:", emailErr.message);
            }
            return res.json({ 
                status: "success", 
                message: "Policy approved and created successfully",
                data: { policy_id, request_id } 
            });
        } 
        else 
        {
            await new sql.Request(tx)
                .input("request_id", sql.Int, request_id)
                .input("employee_id", sql.Int, employee_id)
                .input("notes", sql.NVarChar(500), notes)
                .query(`
                    UPDATE dbo.PolicyRequest
                    SET status = 'Rejected',
                        notes = @notes,
                        approved_by_employee_id = @employee_id,
                        approved_at = SYSUTCDATETIME()
                    WHERE request_id = @request_id;
                `);
            try 
            {
                await sendEmail(
                {
                    email: customerEmail,
                    subject: "Your insurance request has been rejected",
                    template: "policyRequestRejected",
                    user: {
                        name: customerFirstName
                    },
                    url: '#'
                });
            } 
            catch (emailErr) 
            {
                console.error("Email failed:", emailErr.message);
            }
            await tx.commit();
            return res.json({ 
                status: "success", 
                message: "Policy request rejected",
                data: { request_id, status: "Rejected" } 
            });
        }
    } 
    catch (err) 
    {
        if (tx) await tx.rollback();
        console.error(err);
        return res.status(500).json({ status: "error", message: "Review process failed", error: err.message });
    }
}
