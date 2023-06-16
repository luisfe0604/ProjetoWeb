const {Sequelize, DataTypes, where} = require("sequelize")
const sequelize = require("../helpers/pg")

const ChessGame = sequelize.define('chessGame', 
    {
        game:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        player1: DataTypes.STRING,
        player2: DataTypes.STRING,
        winner: DataTypes.STRING,
        time: DataTypes.TIME,
        moves: DataTypes.TEXT
    }
)

module.exports = {
    list: async function(limit, offset) {
        const games = await ChessGame.findAll( { limit: limit, offset: offset } )
        return games
    },
    
    save: async function(player1, player2, winner, time, moves) {
        const games = await ChessGame.create({
            player1: player1,
            player2: player2,
            winner: winner,
            time: time,
            moves: moves
        })
        return games
    },

    update: async function(id, obj) {
        
        let games = await ChessGame.findByPk(id)
        if (!games) {
            return false
        }
        
        Object.keys(obj).forEach(key => games[key] = obj[key])
        await games.save()
        return games
    },

    delete: async function(id) {
        const games = await ChessGame.findByPk(id)
        return games.destroy()
    },

    getById: async function(game) {
        return await ChessGame.findByPk(game)
    },

    Model: ChessGame
}