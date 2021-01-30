const mongoose = require('mongoose')
const moment = require('moment')

const exerciseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String
    },
    duration: {
        type: Number
    },
    date: Date
})

exerciseSchema.methods.toJSON = function () {
    //removes properties from the JSON returned object
    const exercise = this
    const exObj = exercise.toObject()
    exObj.date = moment.utc(new Date(exObj.date)).format('ddd MMM DD YYYY')
    delete exObj.__v
    delete exObj._id
    return exObj
}

const Exercise = mongoose.model('Exercise', exerciseSchema)

module.exports = Exercise