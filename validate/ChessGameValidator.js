const Joi = require("joi")

const TaskSchema = Joi.object({
    game: Joi.number()
        .integer()
        .greater(0),
    player1: Joi.string()
        .min(3)
        .max(30)
        .required(),
    player2: Joi.string()
        .min(3)
        .max(30)
        .required(),
    winner: Joi.string()
        .min(3)
        .max(30)
        .required(),
    time: Joi.string()
        .required(),
    moves: Joi.string()
        .required()
}).with("game", "info")

module.exports = {
    validateId: function (req, res, next) {
        const { error, value } = Joi.number()
            .integer()
            .greater(0)
            .validate(req.params.id)

        if (error) {
            return res.status(500).json({ status: false, msg: "O código não é válido" });
        }

        req.params.id = value
        return next()
    },
    validateInfo: function (req, res, next) {
        const { error, value } = TaskSchema.validate(req.body);
        if (error) {
            return res.json({ status: false, msg: "Dados incorretos/incompletos" })
        }
        req.body = value
        return next()
    }
}