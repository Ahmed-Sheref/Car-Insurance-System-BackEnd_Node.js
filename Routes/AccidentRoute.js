import express from 'express'
import * as Acccontrol from '../Controllers/AccidentControl.js';
import { authMiddleware } from '../middlewares/authmiddlware.js';


export const router = express.Router();


/**
 * @openapi
 * /api/v1/accident:
 *   post:
 *     summary: Create accident and store image
 *     tags: [Accident]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - acc_description
 *               - location
 *               - accident_date
 *               - car_id
 *               - customer_id
 *               - acc_image
 *             properties:
 *               acc_description:
 *                 type: string
 *                 example: "Rear collision"
 *               location:
 *                 type: string
 *                 example: "Nasr City"
 *               accident_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-01-20"
 *               car_id:
 *                 type: integer
 *                 example: 12
 *               customer_id:
 *                 type: integer
 *                 example: 5
 *               acc_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Accident and image data inserted successfully"
 *       400:
 *         description: Invalid fields (date/id)
 *       500:
 *         description: Database error
 */

router.route('/').post(authMiddleware , Acccontrol.AccidentControl);