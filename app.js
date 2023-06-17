const express = require("express")
const path = require("path")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use("/chess", require("./control/ChessAPI"))
app.use("/chess", require("./control/InstallAPI"))
app.use("/chess", require("./control/UserAPI"))
app.use("/chess", require("./control/TournamentAPI"))
app.use("/chess", require("./control/ChessGameAPI"))
app.use("/chess", require("./control/RatingControlAPI"))

app.listen(process.env.PORT, () => {
    console.log("Listenning...")
})