import express from 'express';
import * as users from '../Controllers/users.js';
import * as car from '../Controllers/carControl.js';
import { protect } from '../Controllers/auth.js';

export const router = express.Router();

router.get('/me', protect, users.me);

router.route('/car')
    .get(protect, car.getMyCars)
    .post(protect, car.addCar)
    
router.route('/car/:car_id')
    .patch(protect, car.updateCar)
    .delete(protect, car.deleteCar)

export default router;