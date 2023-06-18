const express = require("express")
const router = express.Router()

const {sucess, fail} = require("../helpers/answer")
const ChessGameDAO = require("../model/ChessGame")
const ValidateToken = require("../validate/token")
const ChessGameValidator = require("../validate/ChessGameValidator")

//---------------ROTA DE BUSCAR PARTIDAS---------------
router.get("/game/search/:id", ValidateToken.validateToken, (req, res) => {

    const {id} = req.params

    ChessGameDAO.getById(id)
    .then(list => {
        res.json(sucess(list))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao listar partida"))
    })
})
//---------------ROTA DE LISTAR PARTIDAS---------------
router.get("/game/list", ValidateToken.validateToken, async (req, res) => {

    let limit = 5
    let page = req.query.page
    
    if(!page){
        page = 1
    }

    let offset = (limit * page) - limit

    ChessGameDAO.list(limit, offset)
    .then(list => {
        res.json(sucess(list))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao listar partidas"))
    })
})

//---------------ROTA DE CADASTRO DE PARTIDAS---------------
router.post("/game/register", ValidateToken.validateToken, ChessGameValidator.validateInfo, ValidateToken.isCoach, (req, res) => {

    const {player1, player2, winner, time, moves} = req.body

    ChessGameDAO.save(player1, player2, winner, time, moves).then(register => {
        res.json(sucess(register))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao registrar nova partida"))
    })
})

//---------------ROTA DE UPDATE DE PARTIDAS---------------
router.put("/game/alter/:id", ValidateToken.validateToken, ChessGameValidator.validateInfo, 
            ChessGameValidator.validateId, ValidateToken.isCoach, async(req, res) => {

    const {id} = req.params

    const {player1, player2, winner, time, moves} = req.body

    let chessGame = {}
    if(player1) chessGame.player1 = player1
    if(player2) chessGame.player2 = player2
    if(winner) chessGame.winner = winner
    if(time) chessGame.time = time
    if(moves) chessGame.moves = moves

    if (chessGame == {}) {
        return res.status(500).json(fail("Nenhum atributo foi modificado"))
    }
    ChessGameDAO.update(id, chessGame).then(alter => {
        res.json(sucess(alter))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao alterar partida"))
    })
})

//---------------ROTA DE DELETE DE PARTIDAS---------------
router.delete("/game/delete/:id", ValidateToken.validateToken, ChessGameValidator.validateId, ValidateToken.isCoach, (req, res) => {
    ChessGameDAO.delete(req.params.id).then(chessGame => {
        if (chessGame)
            res.json(sucess(chessGame))
        else
            res.status(500).json(fail("partida não encontrada"))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao excluir a partida"))
    })
})

module.exports = router