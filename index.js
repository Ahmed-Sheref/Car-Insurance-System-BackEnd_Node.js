import express from 'express';
import cors from 'cors';

// import * as LoginRoute from './Routes/login.js';
import * as PolicyRoute from './Routes/PolicyRoute.js';
import { upload } from './middlewares/multermiddlware.js';
import * as accidentroute from './Routes/AccidentRoute.js';
import { Check_car_id } from './middlewares/Check_car_id.js';
import { LoginToSystem } from './Controllers/LoginControl.js';


export const app = express();
// app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use((req, res , next) => {console.log(req.url); next()});

// Routes (Express)
// app.post('/create-policy', SaveAndCreatePDF);
// app.post('/login', LoginToSystem);

app.post('/api/v1/login', LoginToSystem);


// app.use('/api/v1/login' , LoginRoute.router);
app.use('/api/v1/policy' , PolicyRoute.router);
app.use('/api/v1/accident' , upload.single('acc_image') , Check_car_id , accidentroute.router);