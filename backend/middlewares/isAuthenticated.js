const jwt = require('jsonwebtoken')
const { SECRET } = require('../config').get(process.env.NODE_ENV)

const isAuthenticated = (req, res, next) => {
  const { cookies: { token } } = req
  if (!token) {
    return res.redirect('/login')
  }
  try {
    const { username } = jwt.verify(token, SECRET)
    req.username = username
    return next()
  } catch (err) {
    return res.redirect('/login')
  }
}

module.exports = isAuthenticated
