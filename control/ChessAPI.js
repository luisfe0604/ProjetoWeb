const express = require("express")
const router = express.Router()

const LoginDAO = require("../model/Authenticated")

const jwt = require('jsonwebtoken')

//------------ROTA DE LOGIN-------------
router.post('/login', async function (req, res) {
  const { user, pass, coach } = req.body

  const users = await LoginDAO.loginVerification(user, pass)

  if (users.length > 0) {
    let token = jwt.sign({ user: user, coach: coach }, process.env.SECRET, {
      expiresIn: '1 hr'
    })
    res.json({ status: true, token: token })
  } else {
    res.status(403).json({ status: false, msg: 'Usuario/Senha invalidos' })
  }
})

module.exports = router