import fs from 'fs';
import path from 'path';

// Middleware to validate token
export async function authMiddleware(req, res, next) 
{
    try 
    {
        const auth = req.headers['authorization'];

        if (!auth) 
        {
            return res.status(401).json(
            {
                status: 'fail',
                data: { message: 'Missing Authorization header' }
            });
        }

        if (auth.startsWith('Bearer ')) 
        {
            const token = auth.replace('Bearer ', '').trim();
            const savedTokens = await fs.promises.readFile(`${path.join(import.meta.dirname  , '..' , 'Token.txt')/*./MyProject/Token.txt*/}`, 'utf8');

            if (savedTokens.includes(token)) 
            {
                next();  // Token is valid, proceed to the next middleware/controller
            } 
            else 
            {
                return res.status(401).json(
                {
                    status: 'fail',
                    data: { message: 'Invalid or expired token' }
                });
            }
        } 
        else 
        {
            return res.status(400).json(
            {
                status: 'fail',
                data: { message: 'Invalid Authorization type' }
            });
        }
    } 
    catch (err) 
    {
        console.error(err);
        return res.status(500).json(
        {
            status: 'error',
            data: { message: 'Internal Server Error', error: err.message }
        });
    }
}
