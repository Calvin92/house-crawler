global.Logger = require('./logger')
const Koa = require('koa')
const app = new Koa() 
const router = require('../api')

require('./db.js')

app.use(router.middleware())

module.exports = app

// const { Daily } = require('../model')

// async function createDaily () {
//   console.log('yes...')
//   const res = await Daily.create({
//     time: '20180920',
//     city: 'shenzhen',
//     region: 'baoan',
//     samples: 500,
//     average_price: 35000,
//   })

//   console.log(res)
// }

// createDaily()

