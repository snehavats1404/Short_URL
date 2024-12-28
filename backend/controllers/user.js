const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const { setUser } = require('../service/auth');

async function handleuserSignup(req, res) {
    try {
        const { name, email, password } = req.body;
        
        // Add input validation
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields are required'
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already registered'
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password, // Note: Make sure password is hashed in your User model
        });

        // Generate token for automatic login after signup
        const token = setUser(user);

        // Return success response with token
        return res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'An error occurred during signup'
        });
    }
}

async function handlelogin(req, res) {
    try {
        const { email, password } = req.body;

        // Add input validation
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        // Find user and verify credentials
        const user = await User.findOne({
            email,
            password, // Note: You should use proper password comparison here
        });

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = setUser(user);

        // Set cookie for traditional server-side auth (optional)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Return success response with token
        return res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'An error occurred during login'
        });
    }
}

module.exports = {
    handleuserSignup,
    handlelogin,
};