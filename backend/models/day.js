const mongoose = require('mongoose')

const { Schema, model } = mongoose
const { entrySchema } = require('./entry')

const daySchema = new Schema({
  username: { type: String, required: true },
  date: { type: Date, required: true },
  entries: { type: [entrySchema], default: [] },
})

daySchema.index({ username: 1, date: -1 })

const Day = model('Day', daySchema)

module.exports = Day
