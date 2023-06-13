const express = require("express")
const router = express.Router()

const {sucess, fail} = require("../helpers/answer")
const LoginDAO = require("../model/Authenticated")


module.exports = router