import dotenv from 'dotenv';
import {app} from './index.js'
import path from 'path';

dotenv.config({path: path.join(path.basename(import.meta.dirname), 'data.env')});

app.listen(3000 , () => {console.log('server is running...')})