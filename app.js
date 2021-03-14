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

// 引用路由器
const routes = require('./routes')
// 載入 passport 設定檔
const usePassport = require('./config/passport')
// 引用 mongoose
require('./config/mongoose')

const app = express()

const port = 3000



// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))



// setting static files
app.use(
  express.static('public'),
  bodyParser.urlencoded({ extended: true }),
  methodOverride('_method'))

usePassport(app)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

app.use(routes)

// start and listen on the Express server
app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`)
})