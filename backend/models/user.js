const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { Schema, model } = mongoose

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  days: { type: [mongoose.Types.ObjectId] },
})

userSchema.pre('save', async function hashPass() {
  if (this.isModified('password')) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
  }
})

// check whether entered password is the same as what is stored in the data base
userSchema.methods.checkPassword = function unhashPass(password, cb) {
  bcrypt.compare(password, this.password, (err, isRight) => {
    if (err) {
      cb(err)
    } else {
      cb(null, isRight)
    }
  })
}

const User = model('User', userSchema)

module.exports = User
