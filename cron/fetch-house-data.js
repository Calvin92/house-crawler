// superagent 等无法支持http2
const puppeteer = require('puppeteer')
const cities = require('../fixtures/cities-map.json')
const { Daily } = require('../model')

let currentCityIndex = 0
let result = []
let pageCount = 100
let currentPage = 1

function resetDefaults () {
  result = []
  pageCount = 100
  currentPage = 1
}

async function start () {
  const browser = await puppeteer.launch({ headless: false })


  while (cities[currentCityIndex]) {
    const city = cities[currentCityIndex]
    const regions = city.regions
    let regionsIndex = 0
    while (regions[regionsIndex]) {
      const region = regions[regionsIndex]
      // q房
      while(currentPage <= pageCount) {
        const page = await browser.newPage()
        await page.goto(`https://foshan.qfang.com/sale/${region.spellName}/f${currentPage}`, { waitUntil: 'domcontentloaded' })
        await page.waitFor('.house-detail ul')
    
        if (pageCount === 100) {
          pageCount = await page.evaluate(() => {
            const pageEle = Array.from(document.querySelectorAll('.pages-box .turnpage_num a')).pop()
            if (!pageEle) return 0
            pageCount = isNaN(parseInt(pageEle.textContent)) ? 0 : parseInt(pageEle.textContent)
    
            return pageCount
          })
        }
    
        const res = await page.evaluate(() => {
          const list = document.querySelectorAll('.house-detail ul li')
          let result = []
          for (let item of list) {
            const size = item.querySelectorAll('.house-about span')[3].textContent
            const price = parseInt(item.querySelector('.show-price p').textContent)
            if (!isNaN(price)) {
              result.push({
                size,
                price,
              })
            }
          }
    
          return result
        })
    
        result = result.concat(res)
    
        console.log(`当前爬取的城市：${city.name}-${region.name}，已完成第 ${currentPage} / ${pageCount} 页的数据获取`)
    
        currentPage++
    
        await page.close()
      }

      // 完成一个区域的爬取
      let totalPrice = 0
      let itemsLen = result.length
      for (let item of result) {
        totalPrice += item.price
      }

      const average_price = totalPrice === 0 ? 0 : parseFloat((totalPrice / itemsLen).toFixed(2))

      await Daily.create({
        city: city.name,
        region: region.name,
        average_price,
        samples: itemsLen,
        source: 'qfang',
      })

      console.log(`已完成 ${region.name} 的数据爬取。。。。。。`)

      regionsIndex++

      resetDefaults()
    }

    currentCityIndex++
  }

  await browser.close()
}

module.exports = start