import { readFileSync } from 'fs';
import * as AccidentModel from './../Models/Accident.js'
import sql from 'msnodesqlv8';
import path from 'path'

const connStr =
    'server=.;' + 
    'Database=Project2026;' +
    'Trusted_Connection=Yes;' +          // <— no user/pass needed
    'Driver={ODBC Driver 17 for SQL Server}';

console.log(connStr)

export async function AccidentControl (req , res)
{
    /*
        acc_description:
        location:
        accident_date:
        car_id:
        customer_id:
        binary File:
    */
    let body = req.body;
    console.log(body);
    let new_acc = Fill_info(req);
    try
    {
        new_acc = convertFields(new_acc);
    }
    catch (err)
    {
        res.status(400).json({data : `err:${err}`});
    }
    await Save_TODB(new_acc , req , res)
}

function Fill_info (req)
{
    let body = req.body;
    let accident = new AccidentModel.Accident();
    for (let property in body)
    {
        if (property in accident)
        {
            accident[property] = body[property];
            console.log(accident[property]);
            console.log(typeof(accident[property]));
        }
    }
    return accident
}

function convertFields(data) 
{
    if (data.accident_date) 
    {
        data.accident_date = new Date(data.accident_date);
        if (isNaN(data.accident_date.getTime())) 
        {
            throw new Error('Invalid accident date');
        }
    }

    if (data.car_id) 
    {
        data.car_id = Number(data.car_id);
        if (isNaN(data.car_id)) 
        {
            throw new Error('Invalid car ID');
        }
    }

    if (data.customer_id) 
    {
        data.customer_id = Number(data.customer_id);
        if (isNaN(data.customer_id)) 
        {
            throw new Error('Invalid customer ID');
        }
    }

    return data;
}


export async function Save_TODB (accident , req , res)
{
    let query = `INSERT INTO Accident (acc_description, location, accident_date, car_id, customer_id)
        OUTPUT INSERTED.acc_id
        VALUES (?, ?, ?, ?, ?)`;
    
    let queryimage = 
    `
        INSERT INTO AccidentImages (AccidentId, ImageName, ImageData)
        VALUES (?, ?, ?)
    `

    const { acc_description, location, accident_date, car_id, customer_id } = accident;
    const imageFolderPath = path.join('D:\\Programming\\Back_end\\MyProject\\images'); 
    console.log(imageFolderPath)
    let imagefilename = req.file.filename || 'sample.jpg'; 
    const imagePath = path.join(imageFolderPath, imagefilename);
    let imagedata = readFileSync(imagePath);
    
    const connection = await sql.open(connStr);
    try
    {
        // let Result = await new Promise((resolve , reject) => 
        // {
        //     sql.query(connStr , query , [acc_description, location, accident_date, car_id, customer_id] , (err , rows) =>
        //     {
        //         if (err)
        //         {
        //             reject(err);
        //         }
        //         else
        //         {
        //             resolve(rows[0]);
        //         }
        //     })
        // })
        await connection.query("BEGIN TRANSACTION");
        const accidentResult = await connection.query(query, 
        [
            acc_description,
            location,
            accident_date,
            car_id,
            customer_id
        ]);

        const accidentId = accidentResult[0].acc_id;
        await connection.query(queryimage, [accidentId, imagefilename, imagedata]);

        // Commit the transaction
        await connection.query('COMMIT'); 

        // Respond with success
        res.status(200).json({ message: 'Accident and image data inserted successfully' });
        // await new Promise((resolve , reject) => 
        // {
        //     sql.query(connStr , queryimage , [Result.acc_id , imagefilename , imagedata] , (err, result) => 
        //     {
        //         if (err) reject(err);
        //         else resolve(result);
        //     })
        // })
        // res.status(200).json({ status: 'Accident and image data inserted successfully'});
    }
    catch (err)
    {
        await connection.query('ROLLBACK');
        console.error('Error inserting accident and image data:', err.message);
        return res.status(500).json({ message: 'Error inserting accident and image data', error: err.message });
    }
}