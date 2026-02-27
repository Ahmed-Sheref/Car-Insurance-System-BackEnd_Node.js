import dotenv from 'dotenv';
import path from 'path';
import { app } from './index.js';


// Load environment from data.env at project root
dotenv.config({
    path: path.join(process.cwd(), 'data.env')
});
console.log('DB User Check:', process.env.BASIC_USER);

app.listen(3000, () => 
{
    console.log('server is running...');
}); 