import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from "swagger-ui-express";

// Import passport directly from your config file
import passport from './utils/passport.js';

// Routes
import * as PolicyRoute from './Routes/PolicyRoute.js';
import * as authRoute from './Routes/auth.js';
import * as usersRoute from './Routes/users.js';
import * as adminRoute from './Routes/admin.js';

import { swaggerSpec } from "./swagger.js";
import {protect} from './Controllers/auth.js';
import * as policyadmin from './Routes/policyadmin.js';
import { restrictto } from './Controllers/auth.js';
export const app = express();

// --- MIDDLEWARES ORDER ---
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IMPORTANT: Initialize passport here
app.use(passport.initialize()); 

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((req, res , next) => { console.log(req.url); next(); });

// --- ROUTES ---
app.use('/api/v1/auth', authRoute.router);
app.use('/api/v1/customer', protect, restrictto('Regular', 'individual' , 'admin'), usersRoute.router);
app.use('/api/v1/policy', protect,  restrictto('Regular', 'individual' , 'admin'),PolicyRoute.router);
app.use('/api/v1/policy/admin', protect, restrictto('admin'), policyadmin.router);
app.use('/api/v1/admin', adminRoute.router);

// app.use('/api/v1/accident', upload.single('acc_image'), Check_car_id, accidentroute.router);d




// app.get('/api/v1/admin/policy-request', protect, get_policy_request_admin);
// app.get('/api/v1/admin/policy-request/:req_id', protect, get_policy_request_by_id);
// app.patch('/api/v1/admin/policy-request/:req_id', protect, approve_policy_request);