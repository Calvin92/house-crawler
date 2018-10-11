
const Router = require('koa-joi-router')
const config = require('config')
const router = new Router()

router.prefix(config.apiPrefix)

// daily api
const dailyApi = require('./daily')
router.get('/daily/list', dailyApi.getList)

module.exports = router