'use strict'
// let path = require('path')
let tripModel = require('../models/tripModel')
let tripTitles = []

module.exports = function (req, res) {
  saveTripTitles(req, res)
}

const saveTripTitles = function (req, res) {
  res.end(JSON.stringify(req.body))
  let title = req.body.tripTitleInput
  tripModel.saveTripTitle(title)
}
