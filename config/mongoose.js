// 載入 mongoose
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

// 設定連線到 mongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

// 取得資料庫連線狀態
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db