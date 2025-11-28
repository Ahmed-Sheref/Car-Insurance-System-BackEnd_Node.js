import express from 'express'
import { LoginToSystem } from '../Controllers/LoginControl.js';

export const router = express.Router();


router.route('/').post(LoginToSystem);