const { Sequelize, DataTypes, where } = require("sequelize")
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
    list: async function (limit, offset) {
        const competitions = await Tournament.findAll({ limit: limit, offset: offset })
        return competitions
    },

    save: async function (name, date, award, participants) {
        const competitions = await Tournament.create({
            name: name,
            date: date,
            award: award,
            participants: participants
        })
        return competitions
    },

    update: async function (tournamentId, obj) {

        let competitions = await Tournament.findByPk(tournamentId)
        if (!competitions) {
            return false
        }

        Object.keys(obj).forEach(key => competitions[key] = obj[key])
        await competitions.save()
        return competitions
    },

    delete: async function (tournamentId) {
        const competitions = await Tournament.findByPk(tournamentId)
        return competitions.destroy()
    },

    getById: async function (tournamentId) {
        return await Tournament.findByPk(tournamentId)
    },

    Model: Tournament
}