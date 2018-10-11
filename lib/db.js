const mongoose = require('mongoose')
const config = require('config')
const Promise = require('bluebird')

// Set debug mode as true unless the env is production
mongoose.set('debug', process.env.NODE_ENV !== 'production')

// Use bluebird Promise to ensure better performance
mongoose.Promise = Promise

const db = mongoose.connect(config.mongo.uri, config.mongo.options)

db.then(() => {
  Logger.info('Mongodb connected')
})
.catch(err => {
  Logger.info('Fail to connect to Mongodb:', err)
})