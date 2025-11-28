import express from 'express'
import { SaveAndCreatePDF } from '../Controllers/PolicyControl.js';
import { authMiddleware } from '../middlewares/authmiddlware.js';

export const router = express.Router();


router.route('/').post(authMiddleware , SaveAndCreatePDF);