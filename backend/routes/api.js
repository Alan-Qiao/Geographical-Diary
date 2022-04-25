const express = require('express')

const Day = require('../models/day')

const isAuthenticated = require('../middlewares/isAuthenticated')

const router = express.Router()

router.get('/day/all', isAuthenticated, async (req, res, next) => {
  try {
    const days = await Day.find({ username: req.username }, '_id date')
    res.status(200).json(days)
  } catch (e) {
    console.log(e)
    next(e)
  }
})

router.post('/day/new', isAuthenticated, async (req, res, next) => {
  try {
    const { body: { date }, username } = req
    const result = await Day.create({ username, date: new Date(date) })
    res.status(201).json({ message: `Diary for ${date} created`, data: { _id: result._id, date: result.date } })
  } catch (e) {
    next(e)
  }
})

router.get('/entries/get/:dayId', isAuthenticated, async (req, res, next) => {
  try {
    const { entries } = await Day.findById(req.params.dayId, 'entries')
    res.status(200).json(entries)
  } catch (e) {
    next(e)
  }
})

router.post('/entries/add', isAuthenticated, async (req, res, next) => {
  try {
    const {
      body: {
        dayId, title, time, loc, name, note,
      },
    } = req

    const day = await Day.findById(dayId)
    const entry = day.entries.create({
      title, time: new Date(time), loc, name, note,
    })
    day.entries.push(entry)
    await day.save()
    res.status(201).send(entry)
  } catch (e) {
    next(e)
  }
})

router.post('/entries/modify', isAuthenticated, async (req, res, next) => {
  try {
    const {
      body: {
        dayId, entryId, title, time, loc, name, note,
      },
    } = req

    const day = await Day.findById(dayId)
    const entry = day.entries.id(entryId)
    entry.title = title
    entry.time = new Date(time)
    entry.loc = loc
    entry.name = name
    entry.note = note
    await day.save()
    res.status(201).send(entry)
  } catch (e) {
    next(e)
  }
})

router.post('/entries/delete', isAuthenticated, async (req, res, next) => {
  try {
    const { body: { dayId, entryId } } = req
    const day = await Day.findById(dayId)
    day.entries.id(entryId).remove()
    await day.save()
    res.status(200).send('deleted entry')
  } catch (e) {
    next(e)
  }
})

module.exports = router
