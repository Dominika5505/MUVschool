const Joi = require('@hapi/joi');



// Register Validation
const userValidation = data => {
    const schema = Joi.object().keys({
        firstName: Joi.string().regex(/^(?:[A-zÀ-ú]+)(?:[A-Za-z\u0100-\u017F]*)$/).min(2).max(50).required(),
        lastName: Joi.string().regex(/^(?:[A-zÀ-ú]+)(?:[A-Za-z\u0100-\u017F]*)$/).min(2).max(50).required(),
        email: Joi.string().min(6).required().email(),
        phoneNum: Joi.string().regex(/^[+]?[()/0-9. -]{9,}$/),
        dobDay: Joi.date().min(1).max(31).required(),
        dobMonth: Joi.date().min(1).max(12).required(),
        dobYear: Joi.date().required(),
        address: Joi.string().regex(/^(?:[A-zÀ-ú]+)(?:[A-Za-z0-9\u0100-\u017F ]*)$/).required(),
        city: Joi.string().regex(/^(?:[A-zÀ-ú]+)(?:[A-Za-z\u0100-\u017F ]*)$/).required(),
        PSC: Joi.string().regex(/^[0-9\s]*$/).required(),
        state: Joi.required(),
        pickCourse: Joi.required(),
        inf: Joi.optional(),
        checkbox: Joi.required(),
        checkboxGDPR: Joi.required(),
        parentFirstName: Joi.string().regex(/^(?:[A-zÀ-ú]+)(?:[A-Za-z\u0100-\u017F]*)$/).min(2).max(50).required(),
        parentLastName: Joi.string().regex(/^(?:[A-zÀ-ú]+)(?:[A-Za-z\u0100-\u017F]*)$/).min(2).max(50).required(),
        parentEmail: Joi.string().min(6).required().email(),
        parentPhoneNum: Joi.string().regex(/^[+]?[()/0-9. -]{9,}$/),
        parentInf: Joi.optional()
    });
    return schema.validate(data);
}

const adminValidation = data => {
    const schema = Joi.object().keys({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

// const loginValidation = data => {
//     const schema = {
//         email: Joi.string().min(6).required().email(),
//         password: Joi.string().min(6).required()
//     };
//     return schema.validate(data);;
// }

module.exports.userValidation = userValidation;
module.exports.adminValidation = adminValidation;
// module.exports.loginValidation = loginValidation;