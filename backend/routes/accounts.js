const express = require('express')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const { SECRET } = require('../config').get(process.env.NODE_ENV)

const router = express.Router()

const isAuthenticated = require('../middlewares/isAuthenticated')

router.post('/signup', async (req, res, next) => {
  try {
    const { body: { username, password } } = req
    if (!username || !password) {
      const err = new Error('Missing Entry Information')
      err.statusCode = 400
      next(err)
    }
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      const err = new Error('Username already exists')
      err.statusCode = 409
      next(err)
    }
    await User.create({ username, password })
    res.status(201).send('User created')
  } catch (e) {
    next(e)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { body: { username, password } } = req
    const user = await User.findOne({ username })
    if (!user) {
      const err = new Error('User not found')
      err.statusCode = 404
      next(err)
    }
    user.checkPassword(password, (err, isRight) => {
      if (isRight) {
        const token = jwt.sign({ username: user.username }, SECRET)
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
          .status(200)
          .json({ message: `Logged in ${username}`, user })
        return
      }
      const error = new Error('Incorrect Password')
      error.statusCode = 401
      next(error)
    })
  } catch (e) {
    next(e)
  }
})

router.post('/logout', isAuthenticated, async (req, res, next) => {
  try {
    if (req.username) req.username = null
    res.clearCookie('token').status(200).send('Succesfully logged out')
  } catch (e) {
    next(e)
  }
})

module.exports = router
