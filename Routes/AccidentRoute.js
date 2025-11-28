import express from 'express'
import * as Acccontrol from '../Controllers/AccidentControl.js';
import { authMiddleware } from '../middlewares/authmiddlware.js';


export const router = express.Router();

router.route('/').post(authMiddleware , Acccontrol.AccidentControl);