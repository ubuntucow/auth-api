const Joi = require("@hapi/joi")
const registerValidation = (data) => {
    const schema = new Joi.object({
        name: Joi.string().min(4).required(),
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(4).required()
    })
    return schema.validate(data)




}
const loginValidation = (data) => {
    const schema = new Joi.object({
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(4).required()
    })
    return schema.validate(data)




}
module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
