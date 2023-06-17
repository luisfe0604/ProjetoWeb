const Joi = require("joi")

const TaskSchema = Joi.object({
    id: Joi.number()
        .integer()
        .greater(0),
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),
    age: Joi.number()
        .integer()
        .greater(3)
        .required(),
    cpf: Joi.string()
        .min(14)
        .max(14)
        .required(),
    user: Joi.string()
        .required(),
    pass: Joi.string()
        .min(6)
        .max(30)
        .required(),
    coach: Joi.boolean()
        .required(),
    rating: Joi.number()
        .required()
}).with("id", "info")

module.exports = {
    validateId: function(req, res, next) {
        const {error, value} = Joi.number()
                                 .integer()
                                 .greater(0)
                                 .validate(req.params.id)

        if (error) {
            return res.status(500).json({status: false, msg: "O código não é válido"});
        }

        req.params.id = value
        return next()
    },
    validateInfo: function(req, res, next) {
        const {error, value} = TaskSchema.validate(req.body);
        if (error) {
            return res.json({status: false, msg: "Dados incorretos/incompletos"})
        }
        req.body = value
        return next()
    }
}