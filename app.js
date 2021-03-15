// require packages used in the project
const express = require('express')
// 載入 express-session
const session = require('express-session')
// 載入 express-handlebars 
const exphbs = require('express-handlebars')
// 載入 bodyParser
const bodyParser = require('body-parser')
// 載入 method-override
const methodOverride = require('method-override')
// 載入 connct-flash
const flash = require('connect-flash')

// 判斷應用程式執行模式（development 或是 production mode）
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 引用路由器
const routes = require('./routes')
// 載入 passport 設定檔
const usePassport = require('./config/passport')
// 引用 mongoose
require('./config/mongoose')

const app = express()

const PORT = process.env.PORT



// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))



// setting static files
app.use(
  express.static('public'),
  bodyParser.urlencoded({ extended: true }),
  methodOverride('_method'))

usePassport(app)

app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
  next()
})

app.use(routes)

// start and listen on the Express server
app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`)
})