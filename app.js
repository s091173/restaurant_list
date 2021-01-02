// require packages used in the project
const express = require('express')
// 載入 mongoose
const mongoose = require('mongoose')
// 載入 express-handlebars 
const exphbs = require('express-handlebars')
// 載入 bodyParser
const bodyParser = require('body-parser')
// 載入 method-override
const methodOverride = require('method-override')

// 引用路由器
const routes = require('./routes')

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
  bodyParser.urlencoded({ extended: true }),
  methodOverride('_method'),
  routes)

// start and listen on the Express server
app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`)
})