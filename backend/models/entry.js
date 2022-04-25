const mongoose = require('mongoose')

const { Schema, model } = mongoose

const entrySchema = new Schema({
  title: String,
  time: Date,
  loc: { lat: Number, lng: Number },
  name: String,
  note: String,
})

const Entry = model('Entry', entrySchema)

module.exports = { Entry, entrySchema }
