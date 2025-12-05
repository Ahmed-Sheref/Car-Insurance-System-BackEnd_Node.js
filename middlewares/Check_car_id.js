/* eslint-disable no-undef */
import sql from 'msnodesqlv8';


const connStr =
    'server=.;' + 
    'Database=Project2026;' +
    'Trusted_Connection=Yes;' +
    'Driver={ODBC Driver 17 for SQL Server}';

export async function Check_car_id (req , res , next)
{
    console.log(req.body)
    let carid = Number(req.body.car_id);
    let customerid = Number(req.body.customer_id);
    let query_car = `
        SELECT COUNT(*) FROM policy WHERE car_id = ? AND customer_id = ?
    `;
    let result = await new Promise((resolve , reject) => 
    {
        sql.query(connStr, query_car, [carid, customerid], (err, result) => 
        {
            if (err) 
            {
                reject(err);
            } else 
            {
                resolve(result);
            }
        });
    })
    if (result && result[0].Column0 > 0) next()
    else
    {
        res.status(400).json({data:'undefined'})
    }
}