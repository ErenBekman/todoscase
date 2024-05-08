const Mongoose = require('mongoose')
const db = Mongoose.connection
const config = require('../config/database')

db.once('open', () => {
    console.log(`db connection succesfull and listening : ${process.env.APP_HOST}:${process.env.APP_PORT}`)
})

const connectDB =  async () => {
     await Mongoose.connect(config.mongo_url, {
        dbName: 'todo',
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}


module.exports = { connectDB }