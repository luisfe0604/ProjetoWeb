const express = require("express")
const router = express.Router()

const sequelize = require('../helpers/pg')
const LoginDAO = require("../model/Authenticated")
const CompetitionDAO = require("../model/Tournament")
const GameDAO = require("../model/ChessGame")

//-----------INSTALACAO E POPULACAO DO BD---------------
router.get('/install', async (req, res) => {
  await sequelize.sync({ force: true })

  let competition = await CompetitionDAO.save("chessTour", '2022-12-20', 5000.00, 20)
  let competition1 = await CompetitionDAO.save("Mundial", '2022-06-15', 20000.00, 50)
  let competition2 = await CompetitionDAO.save("Grand Prix", '2022-02-05', 8000.00, 15)
  let competition3 = await CompetitionDAO.save("Candidatos", '2022-11-01', 5000.00, 8)
  let competition4 = await CompetitionDAO.save("Grand Prix", '2022-02-05', 9000.00, 15)

  let game = await GameDAO.save("Magnus", "Caruana", "Magnus", "05:06:30", `1. e4 e5 \n 2. kc3 kf6 \n ...`)
  let game1 = await GameDAO.save("Ding Liren", "MVL", "MagMVLnus", "03:01:40", `1. e4 e5 \n 2. kc3 kf6 \n ...`)
  let game2 = await GameDAO.save("Hikaru Nakamura", "Caruana", "Caruana", "00:06:15", `1. e4 e5 \n 2. kc3 kf6 \n ...`)
  let game3 = await GameDAO.save("Kasparov", "Caruana", "Kasparov", "08:15:18", `1. e4 e5 \n 2. kc3 kf6 \n ...`)
  let game4 = await GameDAO.save("Jorginho", "Clebinho", "-", "00:01:10", `1. e4 e5 \n 2. kc3 kf6 \n ...`)
  let game5 = await GameDAO.save("Juninho", "playeraleatorio", "Juninho", "00:01:10", `1. e4 e5 \n 2. kc3 kf6 \n ...`)

  let user = await LoginDAO.save(process.env.ADM_NAME, process.env.ADM_AGE, process.env.ADM_CPF, process.env.ADM_USER, process.env.ADM_PASS, true, 2800)
  let user1 = await LoginDAO.save("Jorginho", 21, "000.000.000-00", "jorgin", "jor123", false, 1200)
  let user2 = await LoginDAO.save("Paulinho", 19, "000.000.000-01", "paulin", "paulin123", false, 1100)
  let user3 = await LoginDAO.save("Clebinho", 17, "000.000.000-02", "clebin", "clebin123", false, 1600)
  let user4 = await LoginDAO.save("Juninho", 16, "000.000.000-03", "junin", "junin123", false, 1600, 4, 1)

  res.json({
    status: true,
    user: user, user1: user1, user2: user2, user3: user3, user4: user4,
    competition: competition, competition1: competition1, competition2: competition2, competition3: competition3, competition4: competition4,
    game: game, game1: game1, game2: game2, game3: game3, game4: game4, game5: game5
  })
})

module.exports = router