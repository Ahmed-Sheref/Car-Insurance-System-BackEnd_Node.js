import sql from 'mssql';
import { poolPromise } from '../Models/db.js';

// Get all customers for admin
export async function getAllCustomers(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT c.customer_id, c.first_name, c.second_name, c.email, c.customer_type, 
                   c.branch_code, c.created_at
            FROM Customer c
            ORDER BY c.created_at DESC
        `);
        
        res.status(200).json({
            status: 'success',
            data: {
                customers: result.recordset
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Get customer details by ID
export async function getCustomerById(req, res) {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        
        const customerResult = await pool.request()
            .input('customer_id', sql.Int, id)
            .query(`
                SELECT c.customer_id, c.first_name, c.second_name, c.email, c.customer_type, 
                       c.branch_code, c.created_at
                FROM Customer c
                WHERE c.customer_id = @customer_id
            `);
            
        if (!customerResult.recordset || customerResult.recordset.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Customer not found' });
        }
        
        const carsResult = await pool.request()
            .input('customer_id', sql.Int, id)
            .query(`
                SELECT car_id, make, model, year, license_plate, vin
                FROM Cars
                WHERE customer_id = @customer_id
                ORDER BY created_at DESC
            `);
            
        res.status(200).json({
            status: 'success',
            data: {
                customer: customerResult.recordset[0],
                cars: carsResult.recordset
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Get all accidents for admin
export async function getAllAccidents(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT a.accident_id, a.car_id, a.accident_date, a.accident_location, 
                   a.description, a.claim_status, a.estimated_cost, a.final_payout,
                   a.created_at, c.make, c.model, c.license_plate,
                   cust.first_name, cust.last_name, cust.email
            FROM Accidents a
            JOIN Cars c ON a.car_id = c.car_id
            JOIN Customer cust ON c.customer_id = cust.customer_id
            ORDER BY a.created_at DESC
        `);
        
        res.status(200).json({
            status: 'success',
            data: {
                accidents: result.recordset
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Get accident details by ID
export async function getAccidentById(req, res) {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        
        const result = await pool.request()
            .input('accident_id', sql.Int, id)
            .query(`
                SELECT a.accident_id, a.car_id, a.accident_date, a.accident_location, 
                       a.description, a.claim_status, a.estimated_cost, a.final_payout,
                       a.created_at, a.updated_at, c.make, c.model, c.license_plate,
                       cust.first_name, cust.second_name, cust.email, cust.customer_id
                FROM Accidents a
                JOIN Cars c ON a.car_id = c.car_id
                JOIN Customer cust ON c.customer_id = cust.customer_id
                WHERE a.accident_id = @accident_id
            `);
            
        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Accident not found' });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                accident: result.recordset[0]
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Update accident claim status
export async function updateAccidentStatus(req, res) {
    try {
        const { id } = req.params;
        const { claim_status, final_payout, notes } = req.body;
        
        const pool = await poolPromise;
        const request = pool.request();
        
        let query = `
            UPDATE Accidents 
            SET claim_status = @claim_status, updated_at = SYSUTCDATETIME()
        `;
        
        request.input('accident_id', sql.Int, id);
        request.input('claim_status', sql.NVarChar(50), claim_status);
        
        if (final_payout !== undefined) {
            query += `, final_payout = @final_payout`;
            request.input('final_payout', sql.Decimal(10, 2), final_payout);
        }
        
        if (notes) {
            query += `, notes = @notes`;
            request.input('notes', sql.NVarChar(sql.MAX), notes);
        }
        
        query += ` WHERE accident_id = @accident_id`;
        
        await request.query(query);
        
        res.status(200).json({
            status: 'success',
            message: 'Accident status updated successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Get all payments for admin
export async function getAllPayments(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT p.payment_id, p.policy_id, p.amount, p.payment_date, p.payment_method, 
                   p.payment_status, p.transaction_id,
                   pol.policy_number, pol.premium_amount,
                   cust.first_name, cust.second_name, cust.email
            FROM Payments p
            JOIN Policies pol ON p.policy_id = pol.policy_id
            JOIN Customer cust ON pol.customer_id = cust.customer_id
            ORDER BY p.payment_date DESC
        `);
        
        res.status(200).json({
            status: 'success',
            data: {
                payments: result.recordset
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Get all policies for admin
export async function getAllPolicies(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT p.policy_id, p.policy_number, p.customer_id, p.car_id, p.policy_type,
                   p.premium_amount, p.max_coverage, p.start_date, p.end_date, p.policy_status,
                   c.make, c.model, c.license_plate,
                   cust.first_name, cust.second_name, cust.email
            FROM Policies p
            JOIN Cars c ON p.car_id = c.car_id
            JOIN Customer cust ON p.customer_id = cust.customer_id
            ORDER BY p.created_at DESC
        `);
        
        res.status(200).json({
            status: 'success',
            data: {
                policies: result.recordset
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}
