const express = require("express")
const router = express.Router()

const LoginDAO = require("../model/Authenticated")

const jwt = require('jsonwebtoken')

router.post('/login', async function(req, res) {
    const {user, password, coach} = req.body

    const users = await LoginDAO.loginVerification(user, password)

    if (users.length > 0) {
      let token = jwt.sign({user: user, coach: coach}, process.env.SECRET, {
        expiresIn: '1 hr'
      })
      res.json({status:true, token: token})
    } else {
      res.status(403).json({status: false, msg: 'Usuario/Senha invalidos'})
    }
})

module.exports = router