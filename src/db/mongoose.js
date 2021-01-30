const mongoose = require('mongoose')

const db = process.env.DB_URI

mongoose.connect(db.toString(), {
    autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})