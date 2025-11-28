import fs from 'fs';
import crypto from 'crypto';

// Controller for Login and Token Generation
export async function LoginToSystem(req, res) {
    try {
        console.log(req.url);
        let auth = req.headers['authorization'];

        if (!auth) {
            return res.status(401).json({
                status: 'fail',
                data: { message: 'Missing Authorization header' }
            });
        }

        // Basic Authentication (create token)
        if (auth.startsWith('Basic ')) {
            auth = auth.replace('Basic ', '');
            let str = Buffer.from(auth, 'base64').toString();
            const [username, password] = str.split(':');

            if (username === 'ahmed' && password === '472005Medo') {
                const token = await generate_token();
                console.log(token)
                return res.status(200).json({
                    status: 'success',
                    data: {
                        token,
                        token_type: 'Bearer',
                        expires_in: 100000
                    }
                });
            } else {
                return res.status(401).json({
                    status: 'fail',
                    data: { message: 'Invalid username or password' }
                });
            }
        }

        // If Authorization header is neither Basic nor Bearer, return error
        return res.status(400).json({
            status: 'fail',
            data: { message: 'Invalid Authorization type' }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 'error',
            data: { message: 'Internal Server Error', error: err.message }
        });
    }
}

// Function to generate token
// "D:\Programming\Back_end\MyProject\Token.txt"
async function generate_token() {
    const token = crypto.randomBytes(16).toString('hex');
    await fs.promises.writeFile('D:\\Programming\\Back_end\\MyProject\\Token.txt', token + '\n', 'utf-8');
    setTimeout(async () => 
        {
            try 
            { 
                await resetToken(); 
            } 
            catch (err) 
            { 
                console.error(err); 
            }
        }, 100000);
    return token;
}

// Function to reset token
async function resetToken() {
    await fs.promises.writeFile('D:\\Programming\\Back_end\\MyProject\\Token.txt', '', 'utf8');
}
