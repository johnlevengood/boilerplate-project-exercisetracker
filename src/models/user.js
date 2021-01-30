const mongoose = require('mongoose')
const Exercise = require('./exercise')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    }
})

userSchema.virtual('log', {
    ref: 'Exercise',
    localField: '_id',
    foreignField: 'userId'
})

const User = mongoose.model('user', userSchema)

module.exports = User