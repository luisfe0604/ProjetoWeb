const {Sequelize, DataTypes} = require("sequelize")
const sequelize = require("../helpers/pg")

const Authentication = sequelize.define('login', 
    {
        user: DataTypes.STRING,
        pass: DataTypes.STRING,
        coach: DataTypes.BOOLEAN
    }
)

sequelize.sync()

module.exports = {
    list: async function() {
        const users = await Authentication.findAll()
        return users
    },
    
    save: async function(user, pass, coach) {
        const users = await Authentication.create({
            user: user,
            pass: pass,
            coach: coach
        })
        return users
    },

    update: async function(id, obj) {
        
        let users = await Authentication.findByPk(id)
        if (!users) {
            return false
        }
        
        Object.keys(obj).forEach(key => users[key] = obj[key])
        await users.save()
        return users
    },

    delete: async function(id) {
        const users = await Authentication.findByPk(id)
        return users.destroy()
    },

    getById: async function(id) {
        return await Authentication.findByPk(id)
    }
}