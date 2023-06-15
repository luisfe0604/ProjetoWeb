const {Sequelize, DataTypes, where} = require("sequelize")
const sequelize = require("../helpers/pg")

const Tournament = sequelize.define('competition', 
    {
        tournamentId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        date: DataTypes.DATEONLY,
        award: DataTypes.DECIMAL,
        participants: DataTypes.INTEGER
    }
)

module.exports = {
    list: async function() {
        const competitions = await Tournament.findAll()
        return competitions
    },
    
    save: async function(name, date, award, participants) {
        const competitions = await Tournament.create({
            name: name,
            date: date,
            award: award,
            participants: participants
        })
        return competitions
    },

    update: async function(id, obj) {
        
        let competitions = await Tournament.findByPk(id)
        if (!competitions) {
            return false
        }
        
        Object.keys(obj).forEach(key => competitions[key] = obj[key])
        await competitions.save()
        return competitions
    },

    delete: async function(id) {
        const competitions = await Tournament.findByPk(id)
        return competitions.destroy()
    },

    getById: async function(tournamentId) {
        return await Tournament.findByPk(tournamentId)
    },

    Model: Tournament
}