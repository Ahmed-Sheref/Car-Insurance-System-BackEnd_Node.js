import dotenv from 'dotenv';
import {app} from './index.js'

dotenv.config({path: './date.env'});

// eslint-disable-next-line no-undef
app.listen(3000 , () => {console.log('server is running...')})