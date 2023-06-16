const express = require("express")
const router = express.Router()

const {sucess, fail} = require("../helpers/answer")
const LoginDAO = require("../model/Authenticated")
const ValidateToken = require("../validate/token")


//---------------ROTA DE CADASTRO---------------
router.post("/register", ValidateToken.validateToken, ValidateToken.isCoach, (req, res) => {

    const {name, age, cpf, user, pass, coach, rating, game, tournamentId} = req.body

    LoginDAO.save(name, age, cpf, user, pass, coach, rating, game, tournamentId).then(register => {
        res.json(sucess(register))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao cadastrar novo usuário"))
    })
})

//---------------ROTA DE UPDATE---------------
router.put("/alter/:id", ValidateToken.validateToken, async(req, res) => {

    const {id} = req.params

    const {name, age, cpf, user, pass, rating, game, tournamentId} = req.body

    let member = {}
    if(name) member.name = name
    if(age) member.age = age
    if(cpf) member.cpf = cpf
    if(user) member.user = user
    if(pass) member.pass = pass
    if(rating) member.rating = rating
    if(game) member.game = game
    if(tournamentId) member.tournamentId = tournamentId

    if (member == {}) {
        return res.status(500).json(fail("Nenhum atributo foi modificado"))
    }
    LoginDAO.update(id, member).then(alter => {
        res.json(sucess(alter))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao alterar usuário"))
    })
})

//---------------ROTA DE DELETE---------------
router.delete("/delete/:id", ValidateToken.validateToken, ValidateToken.isCoach, (req, res) => {
    LoginDAO.delete(req.params.id).then(member => {
        if (member)
            res.json(sucess(member))
        else
            res.status(500).json(fail("Usuário não encontrado"))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao excluir o usuário"))
    })
})

router.put("/alter", ValidateToken.validateToken, (req, res) => {
    
})

module.exports = router