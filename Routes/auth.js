import express from 'express'
import * as auth from '../Controllers/auth.js';
import passport from 'passport';
import JWT from 'jsonwebtoken';
// import process from 'process';
const g_token = (customer_id, customer_type) =>
{
    let token = JWT.sign({customer_id, customer_type} , process.env.JWT_SECRET, {expiresIn:'30m'});
    return token;
}

export const router = express.Router();


router.post('/signUp' , auth.signUp)
router.post('/logIn' , auth.logIn)
router.post('/admin/login' , auth.adminLogin)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));    //google login route

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

router.get('/google/callback',
    // 1. Passport Middleware: Intercepts the request from Google
    // - session: false -> Since we use JWT, we don't need Express sessions
    // - failureRedirect -> Send user to frontend login if they cancel or something goes wrong
    passport.authenticate('google', { session: false, failureRedirect: `${frontendUrl}/login` }),
    
    (req, res) => 
    {
        // 2. Authentication Success: 
        // At this point, the Google Strategy has finished, and the user data is stored in 'req.user'

        // 3. Issue Internal JWT: 
        // protect() looks up by customer_id in the Customer table, so we must pass Customer_id (from Users row), not user_id
        const customerId = req.user.Customer_id ?? req.user.customer_id;
        const customerType = req.user.customer_type;
        const token = g_token(customerId, customerType);

        // 4. Secure Storage: 
        // Set the JWT in an HttpOnly cookie to protect it from XSS attacks
        res.cookie('jwt', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            sameSite: 'Lax' // Basic CSRF protection
        });

        // 5. Final Redirect:
        // Send the user to the frontend with token in hash (SPA can store it)
        res.redirect(`${frontendUrl}/auth/callback#token=${token}`);
    }
);