const express = require("express")
const router = express.Router()

const {sucess, fail} = require("../helpers/answer")
const TournamentDAO = require("../model/Tournament")
const ValidateToken = require("../validate/token")
const TournamentValidator = require("../validate/TournamentValidator")


//---------------ROTA DE LISTAR TORNEIOS---------------
router.get("/tournament/list", ValidateToken.validateToken, (req, res) => {

    let limit = 5
    let page = req.query.page
    
    if(!page){
        page = 1
    }

    let offset = (limit * page) - limit

    TournamentDAO.list(limit, offset)
    .then(list => {
        res.json(sucess(list))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao listar torneios"))
    })
})

//---------------ROTA DE CADASTRO DE TORNEIO---------------
router.post("/tournament/register", ValidateToken.validateToken, TournamentValidator.validateInfo, ValidateToken.isCoach, (req, res) => {

    const {name, date, award, participants} = req.body

    TournamentDAO.save(name, date, award, participants).then(register => {
        res.json(sucess(register))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao cadastrar novo torneio"))
    })
})

//---------------ROTA DE UPDATE DE TORNEIO---------------
router.put("/tournament/alter/:id", ValidateToken.validateToken, TournamentValidator.validateInfo, 
            TournamentValidator.validateId, ValidateToken.isCoach, async(req, res) => {

    const {id} = req.params

    const {name, date, award, participants} = req.body

    let tournament = {}
    if(name) tournament.name = name
    if(date) tournament.date = date
    if(award) tournament.award = award
    if(participants) tournament.participants = participants

    if (tournament == {}) {
        return res.status(500).json(fail("Nenhum atributo foi modificado"))
    }
    TournamentDAO.update(id, tournament).then(alter => {
        res.json(sucess(alter))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao alterar torneio"))
    })
})

//---------------ROTA DE DELETE DE TORNEIO---------------
router.delete("/tournament/delete/:id", ValidateToken.validateToken, TournamentValidator.validateId, ValidateToken.isCoach, (req, res) => {
    TournamentDAO.delete(req.params.id).then(tournament => {
        if (tournament)
            res.json(sucess(tournament))
        else
            res.status(500).json(fail("Torneio não encontrado"))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao excluir o torneio"))
    })
})

module.exports = router