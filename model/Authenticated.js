const { Sequelize, DataTypes} = require("sequelize")
const sequelize = require("../helpers/pg")
const GameModel = require('./ChessGame')
const TournamentModel = require('./Tournament')

const Authentication = sequelize.define('login',
    {
        name: DataTypes.STRING,
        age: DataTypes.INTEGER,
        cpf: DataTypes.STRING,
        user: DataTypes.STRING,
        pass: DataTypes.STRING,
        coach: DataTypes.BOOLEAN,
        rating: DataTypes.INTEGER
    }
)

Authentication.belongsTo(GameModel.Model, {
    foreignKey: 'game'
})
GameModel.Model.hasMany(Authentication, {
    foreignKey: 'game'
})

Authentication.belongsTo(TournamentModel.Model, {
    foreignKey: 'tournamentId'
})
TournamentModel.Model.hasMany(Authentication, {
    foreignKey: 'tournamentId'
})

module.exports = {
    loginVerification: async function (user, pass) {
        try {
            const users = await Authentication.findAll({
                where: {
                    user: user,
                    pass: pass
                }
            })
            return users
        } catch (error) {
            console.log('Usuário não encontrado', error)
            throw error
        }
    },

    list: async function () {
        const users = await Authentication.findAll({ include: GameModel.Model }, { include: TournamentModel.Model })
        return users
    },

    listByRating: async function () {
        const users = await Authentication.findAll({
            include: [GameModel.Model, TournamentModel.Model],
            order: [['rating', 'DESC']]
        });
        return users
    },

    save: async function (name, age, cpf, user, pass, coach, rating, game, tournamentId) {
        if (game instanceof GameModel.Model) {
            game = game.id
        } else if (typeof game === 'integer') {
            obj = await GameModel.getById(game)
            console.log(obj)
            if (!obj) {
                return null
            }
            game = obj.id
        }

        if (tournamentId instanceof TournamentModel.Model) {
            tournamentId = tournamentId.id
        } else if (typeof tournamentId === 'integer') {
            obj = await TournamentModel.getById(tournamentId)
            console.log(obj)
            if (!obj) {
                return null
            }
            tournamentId = obj.id
        }

        const users = await Authentication.create({
            name: name,
            age: age,
            cpf: cpf,
            user: user,
            pass: pass,
            coach: coach,
            rating: rating,
            game: game,
            tournamentId: tournamentId
        })
        return users
    },

    update: async function (id, member) {

        let users = await Authentication.findByPk(id)
        if (!users) {
            return false
        }

        Object.keys(member).forEach(key => users[key] = member[key])
        await users.save()
        return users
    },

    findRating: async function (id) {
        const users = await Authentication.findOne({
            attributes: ['rating'],
            where: {
                id: id
            }
        });
        if (!users) {
            return false;
        }
        return users.rating;
    },

    findName: async function (id) {
        const users = await Authentication.findOne({
            attributes: ['name'],
            where: {
                id: id
            }
        });
        if (!users) {
            return false;
        }
        return users.name;
    },

    findUser: async function (id) {
        const users = await Authentication.findOne({
            attributes: ['user'],
            where: {
                id: id
            }
        });
        if (!users) {
            return false;
        }
        return users.user;
    },

    findGameId: async function (id) {
        const users = await Authentication.findOne({
            attributes: ['game'],
            where: {
                id: id
            }
        });
        if (!users) {
            return false;
        }
        return users.game;
    },

    delete: async function (id) {
        const users = await Authentication.findByPk(id)
        return users.destroy()
    },

    getById: async function (id) {
        return await Authentication.findByPk(id)
    },

    Model: Authentication
}