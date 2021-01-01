// require packages used in the project
const express = require('express')
// 載入 mongoose
const mongoose = require('mongoose')
// 載入 express-handlebars 
const exphbs = require('express-handlebars')
// 載入 bodyParser
const bodyParser = require('body-parser')
// 將 json 載入 Express 
const restaurantList = require('./restaurant.json')
// 載入 restaurant model
const Restaurant = require('./models/restaurant')

const app = express()

const port = 3000

// 設定連線到 mongoDB
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(
  express.static('public'),
  bodyParser.urlencoded({ extended: true }))

// 設定首頁路由
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// New 頁面路由
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

// Create 路由
app.post('/restaurants', (req, res) => {
  const { name, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.create({
    name,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  return Restaurant.find()
    .lean()
    .then(restaurants => restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase())))
    .then(restaurants => res.render('index', { restaurants: restaurants, keyword: keyword }))
    .catch(error => console.log(error))
})

// Read 路由
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// Edit 頁面路由
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// Update 路由
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id

  const { name, category, image, location, phone, google_map, rating, description } = req.body

  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// Delete 路由
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`)
})