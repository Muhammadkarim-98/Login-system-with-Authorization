const Joi = require("joi");
//
const SchemaVal = Joi.object({
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().min(8).required(),
});
//
module.exports = { SchemaVal };