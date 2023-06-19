const express = require("express")
const router = express.Router()

const { sucess, fail } = require("../helpers/answer")
const LoginDAO = require("../model/Authenticated")
const ValidateToken = require("../validate/token")
const UserValidator = require("../validate/UserValidator")

//---------------ROTA DE BUSCAR MEMBROS---------------
router.get("/search/:id", ValidateToken.validateToken, (req, res) => {

    const { id } = req.params

    LoginDAO.getById(id)
        .then(list => {
            res.json(sucess(list))
        }).catch(err => {
            console.log(err)
            res.status(500).json(fail("Falha ao listar membro"))
        })
})

//---------------ROTA DE LISTAR MEMBROS---------------
router.get("/list", ValidateToken.validateToken, (req, res) => {

    let limit = 5
    let page = req.query.page

    if (!page) {
        page = 1
    }

    let offset = (limit * page) - limit

    LoginDAO.list(limit, offset)
        .then(list => {
            res.json(sucess(list))
        }).catch(err => {
            console.log(err)
            res.status(500).json(fail("Falha ao listar membros"))
        })
})
//---------------ROTA DE CADASTRO---------------
router.post("/register", ValidateToken.validateToken, UserValidator.validateInfo, ValidateToken.isCoach, (req, res) => {

    const { name, age, cpf, user, pass, coach, rating, game, tournamentId } = req.body

    LoginDAO.save(name, age, cpf, user, pass, coach, rating, game, tournamentId).then(register => {
        res.json(sucess(register))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao cadastrar novo usuário"))
    })
})

//---------------ROTA DE UPDATE---------------
router.put("/alter/:id", ValidateToken.validateToken, UserValidator.validateInfo,
    UserValidator.validateId, async (req, res) => {

        const { id } = req.params

        const { name, age, cpf, user, pass, rating, game, tournamentId } = req.body

        const userName = await LoginDAO.findUser(id)

        if (!req.coach && userName != req.user) {
            return res.status(403).json(fail({ msg: " Acesso negado, membro comum só pode alterar as próprias informações!" }))
        }

        let member = {}
        if (name) member.name = name
        if (age) member.age = age
        if (cpf) member.cpf = cpf
        if (user) member.user = user
        if (pass) member.pass = pass
        if (rating) member.rating = rating
        if (game) member.game = game
        if (tournamentId) member.tournamentId = tournamentId

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
router.delete("/delete/:id", ValidateToken.validateToken, UserValidator.validateId, ValidateToken.isCoach, (req, res) => {
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

module.exports = router