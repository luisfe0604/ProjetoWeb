const {Sequelize, DataTypes, where} = require("sequelize")
const sequelize = require("../helpers/pg")

const Authentication = sequelize.define('login', 
    {
        name: DataTypes.STRING,
        age: DataTypes.INTEGER,
        cpf: DataTypes.STRING,
        user: DataTypes.STRING,
        pass: DataTypes.STRING,
        coach: DataTypes.BOOLEAN
    }
)

module.exports = {
    loginVerification: async function(user, pass){
        try{
        const users = await Authentication.findAll({
            where: {
            user: user,
            pass: pass
            }
        })  
        return users
    } catch (error){
        console.log('Usuário não encontrado', error)
        throw error
    }
    },
    list: async function() {
        const users = await Authentication.findAll()
        return users
    },
    
    save: async function(name, age, cpf, user, pass, coach) {
        const users = await Authentication.create({
            name: name,
            age: age,
            cpf: cpf,
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