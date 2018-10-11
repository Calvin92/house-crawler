const mongoose = require('mongoose')
const { map } = require('lodash')
const cities = require('../fixtures/cities-map.json')

// function validateTime (time) {
//   const regex = /^20\d{2}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}$/
//   return regex.test(time)
// }

const schemaOptions = { timestamps: true }

const schema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    index: true,
    enum: map(cities, 'name'),
  },

  region: {
    type: String,
    required: true,
  },

  average_price: {
    type: Number,
    required: true,
  },

  samples: { // 样本数量
    type: Number,
    required: true,
  },

  source: { // 来源
    type: String,
    enum: ['lianjia', 'qfang'],
    required: true,
    select: false,
  },
}, schemaOptions)

module.exports = mongoose.model('Daily', schema)