import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { poolPromise } from '../Models/db.js'; 
import sql from 'mssql'; 

// 1. Define the Google Strategy
export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID, 
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        callbackURL: "/api/v1/auth/google/callback" 
    },
    async (accessToken, refreshToken, profile, done) => 
    {
        try 
        {
            const pool = await poolPromise;
            const emailFromGoogle = profile.emails[0].value;
            const displayName = profile.displayName;

            // 1. Search for the user in the 'Customer' table first (where the email exists)
            let customerResult = await pool.request()
                .input('email', sql.VarChar, emailFromGoogle)
                .query('SELECT * FROM Customer WHERE email = @email');

            let customer = customerResult.recordset[0];

            if (customer) 
            {
                // User exists! Now get their associated User record using the customer_id
                let userResult = await pool.request()
                    .input('customerId', sql.Int, customer.customer_id)
                    .query('SELECT * FROM Users WHERE Customer_id = @customerId');
                
                return done(null, userResult.recordset[0]);
            } 
            else 
                {
                // 2. New User: We must create records in BOTH tables to keep the 11-table schema valid
                
                // Step A: Insert into Customer table first
                const newCustomer = await pool.request()
                    .input('email', sql.VarChar, emailFromGoogle)
                    .input('firstName', sql.NVarChar, displayName.split(' ')[0] || 'New')
                    .input('secondName', sql.NVarChar, displayName.split(' ')[1] || 'User')
                    .query(`INSERT INTO Customer (email, first_name, second_name) 
                            OUTPUT INSERTED.* VALUES (@email, @firstName, @secondName)`);
                
                const customerId = newCustomer.recordset[0].customer_id;

                // Step B: Insert into Users table and link it to the new customer_id
                const newUser = await pool.request()
                    .input('username', sql.VarChar, emailFromGoogle.split('@')[0])
                    .input('customerId', sql.Int, customerId)
                    .query(`INSERT INTO Users (username, Customer_id, is_active) 
                            OUTPUT INSERTED.* VALUES (@username, @customerId, 1)`);

                return done(null, newUser.recordset[0]);
            }
        } 
        catch (err) 
        {
            return done(err, null);
        }
    }
);

// 2. Tell passport to use this strategy
passport.use(googleStrategy);

// 3. Export passport itself to use it in index.js
export default passport;