'use strict'
// let path = require('path')
let tripModel = require('../models/tripModel')
let path = require('path')
const VIEWS = path.join(__dirname, 'views')
let tripTitles = []

module.exports = function (req, res) {
  saveTripTitles(req, res)
}

const saveTripTitles = function (req, res) {
  res.render(path.join(__dirname, '../views', 'trips'))
  let title = req.body.tripTitleInput
  tripModel.saveTripTitle(title)
}
