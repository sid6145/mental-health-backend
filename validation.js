const Joi = require('@hapi/joi')


const userRegisterValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
        .min(6)
        .required(),
    email: Joi.string()
        .required()
        .email(),
    password: Joi.string()
        .min(6)
        .required()
    });

  return schema.validate(data);
}

const userLoginValidation = (data) => {
    const schema = Joi.object({
    email: Joi.string()
        .required()
        .email(),
    password: Joi.string()
        .min(6)
        .required()
    });
    
    return schema.validate(data);
}

const doctorRegisterValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
        .min(6)
        .required(),
    email: Joi.string()
        .required()
        .email(),
    specialization: Joi.string()
        .required(),
    password: Joi.string()
        .min(6)
        .required()
    });

  return schema.validate(data);
}

const doctorLoginValidation = (data) => {
    const schema = Joi.object({
    email: Joi.string()
        .required()
        .email(),
    password: Joi.string()
        .min(6)
        .required()
    });

  return schema.validate(data);
}

   

module.exports.userRegisterValidation = userRegisterValidation;
module.exports.userLoginValidation = userLoginValidation;
module.exports.doctorRegisterValidation = doctorRegisterValidation;
module.exports.doctorLoginValidation = doctorLoginValidation;