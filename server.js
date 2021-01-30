const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const PORT = process.env.PORT
require('./src/db/mongoose')
const mongoose = require('mongoose')
const User = require('./src/models/user')
const Exercise = require('./src/models/exercise')
const moment = require('moment')
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', async (req,res) => {
    console.log(req.body)
    const username = req.body.username
    if (!username) {
        return res.status(400)
    }
    try {
        const existing = await User.findOne({username: username})
        if (existing) {
            return res.status(400).send({error: 'already exists'})
        }
        const user = new User({username: username})
        await user.save()
        res.status(200).send({_id: user._id, username: user.username})
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/api/exercise/users', async (req,res) => {
    try {
        const users = await User.find()
        res.status(200).send(users)
    } catch (e) {

    }
})

app.post('/api/exercise/add', async (req,res) => {
    const exercise = new Exercise(req.body)
    if (!exercise.date) {
        exercise.date = moment.utc(new Date()).toDate()
    } else {
        exercise.date = moment.utc(exercise.date, 'YYYY-MM-DD', true).toDate()
    }
    try {
        const user = await User.findById(exercise.userId)
        if (!user) {
            return res.status(400).send({error: 'user does not exist'})
        }
        await exercise.save()
        res.status(201).send({...exercise.toJSON(), username: user.username, userId: undefined, _id: user._id, __v: undefined  })
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/api/exercise/log', async (req,res) => {
    const userId = req.query.userId
    const match = {}

    if (req.query.from && req.query.to) {
        match.date = {
            $gte: moment.utc(req.query.from, 'YYYY-MM-DD', true).startOf('day').toDate(),
            $lt: moment.utc(req.query.to, 'YYYY-MM-DD', true).startOf('day').toDate()
        }
    }
    const limit = parseInt(req.query.limit) || undefined
    try {
        const user = await User.findById(userId)
        await user.populate({
            path:'log',
            match,
            options: {
                limit
            }
        }).execPopulate()
        res.send({...user._doc, log: user.log, __v: undefined, count: user.log.length})
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
    
})

app.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`);
});