const Joi = require('joi');

exports.signupSchema = Joi.object({
    email: Joi.string().required().min(5).max(50).email({
        tlds: { allow: ['com', 'net'] }
    }),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$'))
});

exports.signinSchema = Joi.object({
    email: Joi.string().required().min(5).max(50).email({
        tlds: { allow: ['com', 'net'] }
    }),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$'))
});


