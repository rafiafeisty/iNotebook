const express = require('express');
const User = require('../models/User');  // This should work correctly now
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET='Harryisagood$boy';
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

// ROUTE: 1 Create a user using POST "/api/auth/createuser"
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be of at least 5 letters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);

        success = true;
        res.json({ success, authToken });  // Return success and token properly
    } catch (error) {
        console.error("Error object:", error);

        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        res.status(500).json({ error: 'Internal Server error' });
    }
});

// ROUTE: 2 authenticate a user using POST "/api/auth/login"

router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: "Please enter correct credentials" });
    }

    const { email, password } = req.body;

    try {
        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        // Compare the password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        // Generate JWT Token
        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET);

        // Return success and token
        success = true;
        res.json({ success, authToken });  // Changed `token` to `authToken` for consistency
    } catch (error) {
        console.error('An error occurred during login:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

//ROUTE: 3 get logged user details POST "/api/auth/getuser" login required

router.post('/getuser',fetchuser, async (req, res) => {
try {
    userId=req.user.id;
    const user=await User.findById (userId).select("-password");
    res.send(user);
    
} catch (error) {
    // Log the error for debugging
    console.error('An error occurred during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
})

module.exports = router;
