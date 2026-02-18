import sql from 'mssql';
import { poolPromise } from '../Models/db.js';
import decodeVin from '../utils/getCarData.js';

export async function addCar(req, res) 
{
    try
    {
        const {vin} = req.body;
        const carData = await decodeVin(vin);
        const {model, year, make} = carData;
        const pool = await poolPromise;
        const request = new sql.Request(pool);
        const result = await request
            .input('model', sql.VarChar(50), model)
            .input('year', sql.Int, year)
            .input('make', sql.VarChar(50), make)
            .input('customer_id', sql.Int, req.customer_id)
            .input('vin', sql.VarChar(50), vin)
            .query(`INSERT INTO dbo.Car (model, year, make, customer_id, vin) 
                    OUTPUT INSERTED.* VALUES (@model, @year, @make, @customer_id, @vin)`);
        res.status(200).json({ status: 'success', message: 'Car added successfully', data: result.recordset });
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

export async function getMyCars(req , res , next)
{
    try
    {
        const customer_id = req.customer_id;

        const pool = await poolPromise;
        const request = new sql.Request(pool);
        const result = await request.input('customer_id', sql.Int, customer_id).query('SELECT * FROM dbo.Car WHERE customer_id = @customer_id');
        res.status(200).json({ status: 'success', message: 'Cars fetched successfully', data: {cars: result.recordset} });
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}



export async function updateCar(req , res , next)
{
    try
    {
        const car_id = req.params.car_id;
        const {model, year, make} = req.body;
        const pool = await poolPromise;
        const request = new sql.Request(pool);
        const result = await request.input('car_id', sql.Int, car_id).input('model', sql.VarChar(50), model).input('year', sql.Int, year).input('make', sql.VarChar(50), make).query('UPDATE dbo.Car SET model = @model, year = @year, make = @make WHERE car_id = @car_id');
        res.status(200).json({ status: 'success', message: 'Car updated successfully', data: {car: result.recordset} });
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

export async function deleteCar(req , res , next)
{
    try
    {
        const car_id = req.params.car_id;
        const pool = await poolPromise;
        const request = new sql.Request(pool);
        const result = await request.input('car_id', sql.Int, car_id).query('DELETE FROM dbo.Car WHERE car_id = @car_id');
        res.status(200).json({ status: 'success', message: 'Car deleted successfully', data: {car: result.recordset} });
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

export async function getCarById(req , res , next)
{
    try
    {
        const car_id = req.params.car_id;
        const pool = await poolPromise;
        const request = new sql.Request(pool);
        const result = await request.input('car_id', sql.Int, car_id).query('SELECT * FROM dbo.Car WHERE car_id = @car_id');
        res.status(200).json({ status: 'success', message: 'Car fetched successfully', data: {car: result.recordset} });
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}