// 載入 bcrypt
const bcrypt = require('bcryptjs')

// 判斷應用程式執行模式（development 或是 production mode）
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 載入 Restaurant Model 
const Restaurant = require('../restaurant')
// 載入 User Model
const User = require('../user')
// 載入 json 資料
const restaurantList = require('../../restaurant.json')
// 引用 mongoose 
const db = require('../../config/mongoose')

const SEED_USERS = [{
  email: 'user1@example.com',
  password: '12345678'
}, {
  email: 'user2@example.com',
  password: '12345678'
}]


db.once('open', () => {

  SEED_USERS.forEach((user, index) => {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(user.password, salt))
      .then(hash => User.create({ // 創建 User
        email: user.email,
        password: hash
      }))
      .then(seeduser => {
        const userId = seeduser._id
        const restaurantData = restaurantList.results

        return Promise.all(
          Array.from(
            { length: 3 },
            (v, i) =>
              Restaurant.create({ // 創建 Restaurant
                name: restaurantData[i + (index * 3)].name,
                category: restaurantData[i + (index * 3)].category,
                image: restaurantData[i + (index * 3)].image,
                location: restaurantData[i + (index * 3)].location,
                phone: restaurantData[i + (index * 3)].phone,
                google_map: restaurantData[i + (index * 3)].google_map,
                rating: restaurantData[i + (index * 3)].rating,
                description: restaurantData[i + (index * 3)].description,
                userId
              })
          ))
      })
      .then(() => {
        console.log('done creating seed data.')
        process.exit()
      })
      .catch(err => console.log(err))
  })
})