export class Accident 
{
    constructor() 
    {
        this.acc_id = 0;              
        this.acc_description = "";    
        this.location = "";          
        this.accident_date = "";      
        this.car_id = 0;              
        this.customer_id = 0;                 
    }

    setAccidentDetails(acc_id, acc_description, location, accident_date, car_id, customer_id) 
    {
        this.acc_id = acc_id;
        this.acc_description = acc_description;
        this.location = location;
        this.accident_date = accident_date;
        this.car_id = car_id;
        this.customer_id = customer_id;
    }

    getAccidentDetails() 
    {
        return {
            acc_id: this.acc_id,
            acc_description: this.acc_description,
            location: this.location,
            accident_date: this.accident_date,
            car_id: this.car_id,
            customer_id: this.customer_id,
        };
    }
}
