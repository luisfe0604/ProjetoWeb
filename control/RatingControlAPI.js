const express = require("express")
const router = express.Router()
const EloRating = require('elo-rating')

const {sucess, fail} = require("../helpers/answer")
const LoginDAO = require("../model/Authenticated")
const ChessGameDAO = require("../model/ChessGame")
const ValidateToken = require("../validate/token")
const UserValidator = require("../validate/UserValidator")

//---------------ROTA DE LISTAR PARTIDAS (RATING)---------------
router.get("/rating/listRating", ValidateToken.validateToken, async (req, res) => {

    let limit = 5
    let page = req.query.page
    
    if(!page){
        page = 1
    }

    let offset = (limit * page) - limit

    LoginDAO.listByRating(limit, offset)
    .then(list => {
        res.json(sucess(list))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao listar membros"))
    })
})

//---------------ROTA DE ATUALIZACAO DE RATING COM PARTIDAS---------------
router.put("/rating/alterRating/:id", ValidateToken.validateToken, UserValidator.validateId, async(req, res) => {

    const {id} = req.params
    const {game, opponentRating} = req.body

    let rating = await LoginDAO.findRating(id)
    let playerName = await LoginDAO.findName(id)
    let player1 = await ChessGameDAO.findPlayer1(game)
    let player2 = await ChessGameDAO.findPlayer2(game)
    let winner = await ChessGameDAO.findWinner(game)
    let playersRating
    
    if (player1 === playerName){
        if(playerName === winner){
            playersRating = EloRating.calculate(rating, opponentRating, true)
        }else if(player2 === playerName){
            playersRating = EloRating.calculate(rating, opponentRating, false)
        }else{
            playersRating = EloRating.calculate(rating, opponentRating, 0.5)
        }
    }else if(player2 === playerName){
        if(playerName === winner){
            playersRating = EloRating.calculate(rating, opponentRating, true)
        }else if(player1 === playerName){
            playersRating = EloRating.calculate(rating, opponentRating, true)
        }else{
            playersRating = EloRating.calculate(rating, opponentRating, 0.5)
        }
    }
    let member = {}
    if(rating) member.rating = playersRating.playerRating
    if(game) member.game = game

    if (member == {}) {
        return res.status(500).json(fail("Nenhum atributo foi modificado"))
    }
    LoginDAO.update(id, member).then(alter => {
        res.json(sucess(alter))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao alterar rating do usuário"))
    })
})

module.exports = router