const express = require("express")
const router = express.Router()

const {sucess, fail} = require("../helpers/answer")
const LoginDAO = require("../model/Authenticated")
const ValidateToken = require("../validate/token")


router.post("/register", ValidateToken.validateToken, ValidateToken.isAdmin, (req, res) => {

    const {name, age, cpf, user, pass, coach, rating, game, tournamentId} = req.body

    LoginDAO.save(name, age, cpf, user, pass, coach, rating, game, tournamentId).then(register => {
        res.json(sucess(register))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao cadastrar novo usuário"))
    })
})



module.exports = router