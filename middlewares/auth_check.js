import fs from 'fs';
import crypto from 'crypto';

export async function authenticate(req, res) 
{
    try 
    {
        let auth = req.headers['authorization'];

        if (!auth) 
        {
            return res.status(401).json({
                status: 'fail',
                data: { message: 'Missing Authorization header' }
            });
        }

        if (auth.startsWith('Basic ')) 
        {
            auth = auth.replace('Basic ', '');
            let str = Buffer.from(auth, 'base64').toString(); 
            const [username, password] = str.split(':');

            if (username === 'ahmed' && password === '472005Medo') 
            {
                const token = await generate_token();
                return res.status(200).json({
                    status: 'success',
                    data: {
                        token,
                        token_type: 'Bearer',
                        expires_in: 100000
                    }
                });
            } 
            else 
            {
                return res.status(401).json({
                    status: 'fail',
                    data: { message: 'Invalid username or password' }
                });
            }
        }

        else if (auth.startsWith('Bearer ')) 
        {
            const token = auth.replace('Bearer ', '').trim();
            const savedTokens = await fs.promises.readFile('./Back_end/MyProject/Token.txt', 'utf8');

            if (savedTokens.includes(token)) 
            {
                return res.status(200).json({
                    status: 'success',
                    data: { message: 'Token is valid' }
                });
            } 
            else 
            {
                return res.status(401).json({
                    status: 'fail',
                    data: { message: 'Invalid or expired token' }
                });
            }
        }
        else 
        {
            return res.status(400).json({
                status: 'fail',
                data: { message: 'Invalid Authorization type' }
            });
        }
    }
    catch (err) 
    {
        console.error(err);
        return res.status(500).json({
            status: 'error',
            data: { message: 'Internal Server Error', error: err.message }
        });
    }
}

async function generate_token() 
{
    const token = crypto.randomBytes(16).toString('hex');
    console.log('Generated token:', token);
    await fs.promises.appendFile('./Back_end/MyProject/Token.txt', token + '\n', 'utf-8');
    setTimeout(resetToken, 100000); 
    return token;
}

async function resetToken() 
{
    console.log('Resetting token...');
    await fs.promises.writeFile('./Back_end/MyProject/Token.txt', '', 'utf8');
}
