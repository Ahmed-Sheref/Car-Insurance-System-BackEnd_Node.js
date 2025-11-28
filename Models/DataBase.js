import sql from 'msnodesqlv8';
import { DateTime } from 'luxon';

const connStr =
    'server=.;' + 
    'Database=Project2026;' +
    'Trusted_Connection=Yes;' +          // <— no user/pass needed
    'Driver={ODBC Driver 17 for SQL Server}'; // or 18 if you installed that

const query = `
    INSERT INTO dbo.Policy 
(customer_id, car_id, coverage_type, start_date, end_date, premium, max_coverage, status)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);
`;

// const q2 = `SELECT cu.Customer_id, ca.Car_id
// FROM dbo.Customer AS cu
// INNER JOIN dbo.Users AS u
//   ON u.Customer_id = cu.Customer_id
// INNER JOIN dbo.Car AS ca
//   ON ca.Customer_id = cu.Customer_id
// WHERE u.username = 'omar adel'
//   AND u.[password] = '472005';`

const validateDate = (date) => {
    const parsedDate = DateTime.fromFormat(date, 'yyyy-MM-dd');
    if (!parsedDate.isValid) {
        console.error("Invalid date:", date);  
    }
    return parsedDate.isValid ? parsedDate.toISODate() : null;  
};

export function save_policy_to_db(policy) 
{
    const params = 
    [
        policy.customer_id ? Number(policy.customer_id) : null,
        policy.car_id ? Number(policy.car_id) : null,
        policy.coverage_type ?? null,
        validateDate(policy.start_date),
        validateDate(policy.end_date),
        policy.premium_total != null ? Number(policy.premium_total) : null,
        policy.max_coverage != null ? Number(policy.max_coverage) : null,
        policy.policy_status ?? null,              // <— include this
    ];
        // let rs;
        return new Promise((resolve, reject) => 
        {
            sql.query(connStr, query, params, (err, rows) => 
            {
                console.log(rows);
                if (err) reject(err);
                else resolve(rows);
            });
        });
}

