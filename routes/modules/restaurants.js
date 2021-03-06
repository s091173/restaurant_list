// restaurants 路由模組
const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// New 頁面路由
router.get('/new', (req, res) => {
  res.render('new')
})

// Create 路由
router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.create({
    name,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
    userId
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// Read 路由
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// Edit 頁面路由
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// Update 路由
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  const { name, category, image, location, phone, google_map, rating, description } = req.body

  return Restaurant.findOne({ _id, userId })
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
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

// Delete 路由
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router