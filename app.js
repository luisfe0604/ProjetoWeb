const express = require("express")
const path = require("path")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use("/chess", require("./control/ChessAPI"))

app.listen(process.env.PORT, () => {
    console.log("Listenning...")
})