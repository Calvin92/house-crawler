const { Daily } = require('../model')

exports.getList = {
  handler: async (ctx, next) => {
    const result = await Daily.find()
    ctx.body = result
  },
}