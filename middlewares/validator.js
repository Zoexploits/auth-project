const Joi = require('joi');

exports.signupSchema = Joi.object({
    email: Joi.string().email().required().min(5).max(50),
    password: Joi.string().min(6).max(20).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
}).with('password', 'confirmPassword');