// home 路由模組

// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引用 Restaurant Model 
const Restaurant = require('../../models/restaurant')

// 定義首頁路由
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// search request route
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  return Restaurant.find()
    .lean()
    .then(restaurants => restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase())))
    .then(restaurants => res.render('index', { restaurants: restaurants, keyword: keyword }))
    .catch(error => console.log(error))
})

// 匯出路由模組
module.exports = router
