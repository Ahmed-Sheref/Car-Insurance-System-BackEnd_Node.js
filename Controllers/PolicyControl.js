import Create_Policy_PDF, * as Policy_Check from './../Models/Policy.js';
import { Policy } from './../Models/Policy.js';
import { save_policy_to_db } from './../Models/DataBase.js';

export async function SaveAndCreatePDF(req, res)
{
    try 
    {
        let body = await readBody(req);
        let data = Handle_body(body);
        if (!Policy_Check.Check_premium(data.max_coverage , data.premium_total))
        {
            return res.status(400).json(
            {
                status: 'fail',
                data: { message: 'premium_total should be >= (max_coverage / 5)' }
            });
        }
        if (!(Policy_Check.Check_Date(data.start_date, data.end_date)))
        {
            return res.status(400).json(
            {
                status: 'fail',
                data: { message: 'Invalid date range: end_date must be after start_date' }
            });
        }
        console.log(Policy_Check.Check_Date(data.start_date, data.end_date))
        const policy = new Policy();
        policy.Save_info_policy(data);
        const pdfPath = await Create_Policy_PDF(policy);
        console.log('Create PDF...', pdfPath);
        const dbRows = await save_policy_to_db(policy);
        console.log('Save to DataBase...', dbRows);

        return res.status(201).json({
            status: 'success',
            data:
            {
                message: 'Saved to DB and created PDF',
                pdfPath,
                insertedId: dbRows?.[0] ?? null
            }
        });
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).json({
            status: 'error',
            data: { message: 'Internal Server Error', error: err.message }
        });
    }
}

async function readBody(req) 
{
    return new Promise((resolve, rejects) => 
    {
        let body = '';
        req.on('data', (chunk) => 
        {
            body += chunk;
        });
        req.on('end', () => resolve(body));
        req.on('error', (err) => rejects(err));
    });
}

function Handle_body(body) 
{
    let data = {};
    console.log(decodeURIComponent(body));
    console.log('------------');
    body = body.split('&');
    body.forEach(element => 
    {
        element = element.split('=');
        data[decodeURIComponent(element[0])] = decodeURIComponent(element[1]).replace(/\+/g, ' ');
    });
    for (const key in data) 
    {
        console.log(key, "=", data[key]);
    }
    console.log(data);
    return data;
}