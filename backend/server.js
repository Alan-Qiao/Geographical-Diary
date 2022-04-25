const express = require('express')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const path = require('path')

const db = require('./config').get(process.env.NODE_ENV)

const AccountRouter = require('./routes/accounts')
const ApiRouter = require('./routes/api')

mongoose.connect(db.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const app = express()

app.use(express.json())

app.use(cookieParser())

app.use(express.static('dist'))

app.use('/account', AccountRouter)
app.use('/', ApiRouter)

app.get('/authenticated', (req, res) => {
  const { cookies: { token } } = req
  if (!token) {
    return res.status(200).send('false')
  }
  try {
    const { username } = jwt.verify(token, db.SECRET)
    return res.status(200).send(username)
  } catch (err) {
    return res.status(200).send('false')
  }
})

app.use((err, req, res, next) => {
  if (res.headersSent) {
    next(err)
    return
  }
  res.status(err.statusCode || 500).json({ error: err, message: err.message })
})

app.get('/favicon.ico', (req, res) => {
  res.status(404).send()
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(3000, () => {
  console.log('listening on 3000')
  console.log('mongoDB is connected')
})
