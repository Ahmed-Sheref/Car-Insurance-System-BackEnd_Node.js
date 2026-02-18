import express from 'express'
import * as policy from '../Controllers/PolicyControl.js';
import { protect, restrictto } from '../Controllers/auth.js';
// import { adminProtect } from '../Controllers/admin.js';


export const router = express.Router();

router.route('/policy-requests')
    .get(protect, policy.get_policy_request_admin)

router.route('/policy-requests/:req_id')
    .get(protect, policy.get_policy_request_by_id)
    .patch(protect, policy.approve_policy_request)

// part of admin
