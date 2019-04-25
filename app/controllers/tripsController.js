'use strict'
// let path = require('path')
let tripModel = require('../models/tripModel')
let path = require('path')

const saveTripTitles = function (req, res) {
  res.render(path.join(__dirname, '../views', 'trips'))
  let title = req.body.tripTitleInput
  tripModel.saveTripTitle(title)
  res.render(path.join(__dirname, '../views', 'trips'), { tripTitleList: tripModel.getTripTitles() })
}

const renderTripTitlePage = function (req, res) {
  res.render(path.join(__dirname, '../views', 'trips'), { tripTitleList: tripModel.getTripTitles() })
}

module.exports = {
  saveTripTitles,
  renderTripTitlePage
}
