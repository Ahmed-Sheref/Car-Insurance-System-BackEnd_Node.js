import JWT from 'jsonwebtoken';
import express from 'express';
import bcrypt from 'bcrypt';
import sql from 'mssql'

import { poolPromise } from '../Models/db.js';



const g_token = (customer_id , customer_type) =>
{
    let token = JWT.sign({customer_id, customer_type} , process.env.JWT_SECRET, {expiresIn:'30m'});
    return token;
}

const hashPassword = async (password) =>
{
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
};

export async function signUp(req , res , next)
{
    // 1) read body from req
    // const pool = await poolPromise;
    const
    {
        first_name,
        second_name = null,
        email,
        branch_code,
        customer_type,
        password,
        username = null,
    } = req.body;

    // 1) Basic validation
    if (!first_name || !email || !branch_code || !customer_type || !password) 
    {
        return res.status(400).json(
        {
            status: 'fail',
            message: "Missing required fields: first_name, email, branch_code, customer_type, password",
        });
    }

    if (String(password).length < 8) 
    {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
    }


    const hPassword = await hashPassword(password);

    
    try
    {
        const pool = await poolPromise;
        const tran = new sql.Transaction(pool);
        await tran.begin();

        const request = new sql.Request(tran);

        const insertCustomer = await request
        .input("first_name", sql.NVarChar(50), first_name)
        .input("second_name", sql.NVarChar(50), second_name)
        .input("email", sql.NVarChar(100), email)
        .input("branch_code", sql.Int, branch_code) 
        .input("customer_type", sql.NVarChar(50), customer_type)
        .query(`
            INSERT INTO dbo.Customer (first_name, second_name, email, branch_code, customer_type)
            OUTPUT INSERTED.customer_id
            VALUES (@first_name, @second_name, @email, @branch_code, @customer_type);
        `);

        let customer_id = insertCustomer.recordset[0].customer_id;
        const password_algo = "bcrypt";

        const request2 = new sql.Request(tran);
        await request2
        .input("Customer_id", sql.Int, customer_id)
        .input("username", sql.VarChar(50), username)
        .input("password_hash", sql.NVarChar(255), hPassword)
        .input("password_algo", sql.VarChar(20), password_algo)
        .query(`
            INSERT INTO dbo.Users (Customer_id, username, password_hash, password_algo, password_updated_at, is_active)
            VALUES (@Customer_id, @username, @password_hash, @password_algo, SYSUTCDATETIME(), 1);
        `);

        await tran.commit();

        const token = g_token(customer_id , customer_type);

        const cookieOptions = 
        {
            expires: new Date(Date.now() + 30 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        };

        res.cookie('jwt' , token , cookieOptions)
        res.status(201).json(
            {
                status: 'success',
                data:
                {
                    customer_id,
                    email,
                    token
                }
            }
        )
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

export async function logIn(req , res , next)
{
    const {email , password} = req.body;

    try
    {
        const pool = await poolPromise;

        const result = await pool.request().input('userEmail' , sql.VarChar, email).query(`select count(*) as [count] , customer_id, customer_type from Customer where email = @userEmail group by customer_id, customer_type`);

        if (!result.recordset || result.recordset.length === 0) 
        {
            return res.status(401).json({ status: 'error', message: 'User not found' });
        }   
        let count = result.recordset[0].count;
        let customer_id = result.recordset[0].customer_id;
        let customer_type = result.recordset[0].customer_type;
        if (count === 0)
        {
            throw new Error('User not found');
        }

        const user = await pool.request().input('customer_id' , sql.Int, customer_id).query(`select * from Users where Customer_id = @customer_id`);    
        let password_hash = user.recordset[0].password_hash;

        const isPasswordValid = await bcrypt.compare(password, password_hash);

        if (!isPasswordValid)
        {
            throw new Error('Invalid password');
        }

        const token = g_token(customer_id , customer_type);

        const cookieOptions =
        {
            expires: new Date(Date.now() + 30 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        };

        res.cookie('jwt' , token , cookieOptions)
        res.status(200).json(
        {
            status: 'success',
            data:
            {
                customer_id,
                email,
                token
            }
        });
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

export async function protect(req , res , next) 
{
    try
    {
        // Accept token from cookie (e.g. server redirect) or Bearer header (SPA)
        let token = req.cookies?.jwt;
        if (!token && req.headers.authorization?.startsWith('Bearer '))
            token = req.headers.authorization.replace('Bearer ', '').trim();
        if (!token)
        {
            throw new Error('Unauthorized');
        }
        const decoded = JWT.verify(token, process.env.JWT_SECRET);

        req.customer_id = decoded.customer_id;
        //2) Check if user still exists
        const pool = await poolPromise;
        const result = await pool.request().input('customer_id' , sql.Int, decoded.customer_id).query(`select count(*) as [count] from Customer where customer_id = @customer_id`);
        let count = result.recordset[0].count;
        if (count === 0)
        {
            throw new Error('User not found');
        }
        //3) Check if user changed password after the token was issued
        const user = await pool.request().input('customer_id' , sql.Int, decoded.customer_id).query(`select password_updated_at from Users where Customer_id = @customer_id`);
        let password_updated_at = user.recordset[0].password_updated_at;
        if (!password_updated_at)
        {
            return next();
        }
        const changedAtSeconds = Math.floor(password_updated_at.getTime() / 1000);
        const jwtIatSeconds = Math.floor(decoded.iat);
        if (changedAtSeconds > jwtIatSeconds)
        {
            throw new Error('Password changed');
        }
        next();
    }
    catch (err)
    {
        console.error(err);
        return res.status(401).json({ status: 'error', message: err.message });
    }
}

// export async function logout(req , res , next)

export function restrictto(...role)
{
    const roles = role;
    return function(req ,res, next)
    {
        if (!roles.includes(req.customer_type))
        {
            return res.status(403).json(
            {
                status: 'fail',
                message: 'You do not have permission to perform this action',
            });
        }
        next();
    }
}