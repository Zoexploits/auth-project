const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true,'Email is required'],
        unique: [true,'Email must be unique'],
        minLength: [5,'Email must be at least 5 characters'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true,'Password is required'],
        trim: true,
        select: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },

    verificationCode: {
        type: String,
        select: false,
    },
    verificationCodeValidation: {
        type: Number,
        select: false,
    },
    forgotPasswordCode: {
        type: String,
        select: false,
    },
    forgotPasswordCodeValidation: {
        type: Number,
        select: false,
    },
    
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);