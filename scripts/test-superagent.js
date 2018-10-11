// const superagent = require('superagent')
// const cheerio = require('cheerio')

// // function request (req) {
// //   return new Promise((resolve, reject) => {
    
// //   })
// //   return req.end()
// // }

// async function start () {
//   try {
//     const result = await superagent.get('http://foshan.qfang.com/sale/shunde/f2')
//     const $ = cheerio.load(result.text)
//     console.log(result)
//     const list = $('#cycleListings li')
//     console.log('listlength', list.length)
//   } catch (err) {
//     console.log(err)
//     console.log('加载失败。。。。')
//   }

//   // const 
// }

// start()



// superagent 等无法支持http2
const puppeteer = require('puppeteer')

let result = []
let pageCount = 100
let currentPage = 1

async function test () {
  const browser = await puppeteer.launch({ headless: false })

  while(currentPage < pageCount) {
    const page = await browser.newPage()
    await page.goto(`https://foshan.qfang.com/sale/shunde/f${currentPage}`, { waitUntil: 'domcontentloaded' })
    await page.waitFor('.house-detail ul')
    await page.screenshot({path: 'example.png'})

    if (pageCount === 100) {
      pageCount = await page.evaluate(() => {
        const pageEle = Array.from(document.querySelectorAll('.pages-box .turnpage_num a')).pop()
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

    console.log(`已完成第 ${currentPage} 页的数据获取`)

    currentPage++

    await page.close()
  }

  // console.log(result)
  let totalPrice = 0
  let itemsLen = result.length
  for (let item of result) {
    totalPrice += item.price
  }

  console.log('均价：' + totalPrice / itemsLen)

  await browser.close()
}

test()