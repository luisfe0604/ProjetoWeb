const jwt = require('jsonwebtoken')

module.exports = {
  validateToken(req, res, next) {
    let token = req.headers['authorization']
    if (!token)
      token = ''

    jwt.verify(token, process.env.SECRET, (err, payload) => {
      if (err) {
        res.status(403).json({ status: false, msg: "Acesso negado - Token invalido" })
        return
      }
      req.user = payload.user
      next()
    })
  },
  isCoach(req, res, next) {

    const token = req.headers.authorization;

    jwt.verify(token, process.env.SECRET, (err, payload) => {
      if (err) {
        res.status(403).json({ status: false, msg: 'Acesso negado - Token inválido' });
        return;
      }
      if (payload.coach === true) {
        next();
      } else {
        res.status(403).json({ status: false, msg: 'Acesso negado - Não é um administrador' });
      }
    })
  }
}