import express from 'express';
import * as admin from '../Controllers/admin.js';
import { protect, restrictto } from '../Controllers/auth.js';

export const router = express.Router();

// All admin routes require protection and admin role
router.use(protect);
router.use(restrictto('admin'));

// Customer management
router.route('/customers')
    .get(admin.getAllCustomers);

router.route('/customers/:id')
    .get(admin.getCustomerById);

// Accident management
router.route('/accidents')
    .get(admin.getAllAccidents);

router.route('/accidents/:id')
    .get(admin.getAccidentById)
    .patch(admin.updateAccidentStatus);

// Payment management
router.route('/payments')
    .get(admin.getAllPayments);

// Policy management
router.route('/policies')
    .get(admin.getAllPolicies);
