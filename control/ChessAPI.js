const express = require("express")
const router = express.Router()
const sequelize = require('../helpers/pg')
const {sucess, fail} = require("../helpers/answer")
const LoginDAO = require("../model/Authenticated")
const jwt = require('jsonwebtoken')

router.get('/install', async (req, res) => {
    await sequelize.sync({force: true})

    let user = await LoginDAO.save(process.env.ADM_NAME, process.env.ADM_AGE, process.env.ADM_CPF, process.env.ADM_USER, process.env.ADM_PASS, true)

    res.json({status: true, user: user})
})

router.post('/login', async function(req, res) {
    const {user, password} = req.body

    const users = await LoginDAO.loginVerification(user, password)

    if (users.length > 0) {
      let token = jwt.sign({user: user}, process.env.SECRET, {
        expiresIn: '1 hr'
      })
      res.json({status:true, token: token})
    } else {
      res.status(403).json({status: false, msg: 'Usuario/Senha invalidos'})
    }
})

module.exports = router