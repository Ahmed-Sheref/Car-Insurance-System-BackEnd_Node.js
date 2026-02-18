import sql from 'mssql';
import { poolPromise } from '../Models/db.js';

export async function me(req, res, next) 
{
    const customer_id = req.customer_id;
    const customer_type = req.customer_type;
    try
    {
        const pool = await poolPromise;

        const result = await pool.request().input('customer_id', sql.Int, customer_id).input('customer_type', sql.VarChar, customer_type).query(`SELECT * FROM dbo.Customer WHERE customer_id = @customer_id AND customer_type = @customer_type`);
        let customer = result.recordset[0];

        if (!customer)
        {
            throw new Error('Customer not found');
        }

        res.status(200).json({ status: 'success', data: customer });
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}