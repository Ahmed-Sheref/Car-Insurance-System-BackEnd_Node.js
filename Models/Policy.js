import puppeteer from 'puppeteer';
import ejs from 'ejs';
import path from 'path';
import { promisify } from 'util';
import { DateTime } from 'luxon';
// import { fileURLToPath } from 'url';


const renderFile = promisify(ejs.renderFile.bind(ejs));

// const __filename = fileURLToPath(import.meta.url);
// const __dirname  = path.dirname(__filename);





export class Policy 
{
    #policy_id = 0;
    #car_id = 0;
    #customer_id = 0;
    #coverage_type = "";
    #policy_status = "";
    #start_date;
    #end_date;
    #premium_total = 0;
    #max_coverage = 0;

    get policy_id() {
        return this.#policy_id;
    }
    get car_id() {
        return this.#car_id;
    }
    get customer_id() {
        return this.#customer_id;
    }
    get coverage_type() {
        return this.#coverage_type;
    }
    get policy_status() {
        return this.#policy_status;
    }
    get start_date() {
        return this.#start_date;
    }
    get end_date() {
        return this.#end_date;
    }
    get premium_total() {
        return this.#premium_total;
    }
    get max_coverage() {
        return this.#max_coverage;
    }

    //!-------------------------------------------------------------------------
    set policy_id(value) {
        this.#policy_id = value;
    }
    set car_id(value) {
        this.#car_id = value;
    }
    set customer_id(value) {
        this.#customer_id = value;
    }
    set coverage_type(value) {
        this.#coverage_type = value;
    }
    set policy_status(value) {
        this.#policy_status = value;
    }
    set start_date(value) {
        this.#start_date = DateTime.fromFormat(value , 'yyyy-MM-dd').toISODate();
    }
    set end_date(value) {
        this.#end_date = DateTime.fromFormat(value , 'yyyy-MM-dd').toISODate();
    }
    set premium_total(value) {
        this.#premium_total = value;
    }
    set max_coverage(value) {
        this.#max_coverage = value;
    }


    Save_info_policy = function (policy)
    {
        for (let i in policy)
        {
            this[i] = policy[i];
            console.log(typeof(policy[i]));
        }
    }
}

export function Check_Date (start , end)
{
    const startDate = DateTime.fromFormat(start,'yyyy-MM-dd');
    const endDate = DateTime.fromFormat(end , 'yyyy-MM-dd');
    const now = DateTime.now();


    console.log(startDate.zoneName)
    console.log(now.zoneName)

    console.log('Start Date:', startDate.toISO());  
    console.log('End Date:', endDate.toISO());    
    console.log('Current Date:', now.toISO()); 

    return startDate >= now.startOf('day') && startDate < endDate;
}


export async function Create_Policy_PDF(policy) 
{
    const html = await renderFile('./MyProject/Policy.ejs', { policy });

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfPath = path.resolve('policy.pdf');
    await page.pdf({ path: pdfPath, format: 'A4' });

    await browser.close();

    return pdfPath;
}

export default Create_Policy_PDF;

export function Check_premium (max_coverage , premium_total)
{
    return (premium_total > max_coverage / 5)
}