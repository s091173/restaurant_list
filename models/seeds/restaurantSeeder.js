// 載入 Model 
const Restaurant = require('../restaurant')
// 載入 json 資料
const restaurantList = require('../../restaurant.json')
// 引用 mongoose 
const db = require('../../config/mongoose')

db.once('open', () => {
  restaurantList.results.forEach(restaurant => {
    Restaurant.create({
      name: restaurant.name,
      name_en: restaurant.name_en,
      category: restaurant.category,
      image: restaurant.image,
      location: restaurant.location,
      phone: restaurant.phone,
      google_map: restaurant.google_map,
      rating: restaurant.rating,
      description: restaurant.description
    })
  })
  console.log('done')
})