const jwt = require('jsonwebtoken'); // Import JWT for token generation
const {signupSchema} = require('../middlewares/validator'); // Import validation schema for signup
const {signinSchema} = require('../middlewares/validator'); // Import validation schema for signup
const User = require('../models/usersModel'); // Import User model
const {doHash} = require('../utils/hashing'); // Import hashing utility
const {doHashValidation} = require('../utils/hashing'); // Import hashing utility
const {sendMail} = require('../middlewares/sendMail'); // Import email utility
const transport = require('../middlewares/sendMail');

// Signup controller function
exports.signup = async (req, res) => {
    // Destructure email and password from request body 
    const { email, password } = req.body;

    try {
        // Validate email and password using Joi schema
        const { error, value } = signupSchema.validate({ email, password });
        if (error) {
            // If validation fails, return 400 with error message
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If user exists, return 400 with error
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password (doHash function should be defined/imported elsewhere)
        const hashedPassword = await doHash(password, 12);

        // Create new user with email and hashed password
        const newUser = await User.create({
            email,
            password: hashedPassword
        });
        const result = await newUser.save();
        result.password = undefined; // Remove password from result for security
        // Return success response with user data
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            result,
        });
        // If user is created successfully, return 201 with success message
    } catch (error) {
        // Log any errors that occur during signup
        console.log(error);
    }
};

// Login controller function
exports.signin = async (req, res) => {
    // Destructure email and password from request body
    const { email, password } = req.body;

    try {
        // Find user by email
        const { error, value } = signinSchema.validate({ email, password });
        if (error) {
            // If user not found, return 400 with error message
            return res.
            status(401)
            .json({ success: false, message: error.details[0].message });
        }

        // Compare provided password with hashed password in database
        const existingUser = await User.findOne({ email }).select('+password');
        if (!existingUser) {
            // If passwords do not match, return 400 with error message
            return res.status(400).json({ success: false, message: 'User does not exist' });
        }

        const result = await doHashValidation(password, existingUser.password);
        if (!result) {
            // If passwords do not match, return 400 with error message
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ 
            userId: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified,}, process.env.TOKEN_SECRET, {
                expierw
            }
        );

        // Set token in cookie
        res.cookie('Authorization', 'Bearer', 
            token, {expires:new Date(Date.now() + 8 * 3600000), // 1 day
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
        }).json({
            success: true,
            token,
            message: 'Login successful',
        });

        // If login is successful, remove password from user object
        // existingUser.password = undefined;

        // Return success response with user data
        
    } catch (error) {
        // Log any errors that occur during login
        console.log(error);
    }
};

exports.signout = async (req, res) => {
    res
        .clearCookie('Authorization')
        .status(200)
        .json({
            success: true,
            message: 'Logout successful',
        });
}

exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try {
        // Check if user with the provided email exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            // If user does not exist, return 400 with error message
            return res.
                status(404).
                json({ success: false, message: 'User does not exist' });
            }
            if(existingUser.verified) {
                // If user is already verified, return 400 with error message
                return res.
                    status(400).
                    json({ success: false, message: 'You are already verified' });
            }
            const codeValue = Math.floor(100000 + Math.random() * 900000).toString();
            let info = await transport.sendMail({
                from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
                to: existingUser.email,
                subject: 'Verification Code',
                html: `<h1>Your verification code is ${codeValue}</h1>`,
            });
            if(info.accepted[0] === existingUser.email){
                const hashedCodeValue = hmacProcess.process(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET)
                existingUser.verificationCode = hashedCodeValue;
                existingUser.verificationCodeValidation = Date.now() + 10 * 60 * 1000; // 10 minutes
                await existingUser.save();
                return res.status(200).json({
                    success: true,
                    message: 'Verification code sent successfully',
                });
            }
            res.status(400).json({success: false, message: 'Failed to send verification code'});
        }catch (error) {
        // Log any errors that occur during verification code sending
        console.log(error);
        }
}