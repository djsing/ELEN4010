'use strict'
// let path = require('path')

module.exports = function (req, res) {
  console.log('tripController happens')
  // storeTripTitles(req)
}

const storeTripTitles = function (req) {
  const tripTitleArray = req.query.tripTitle[1]
  tripTitleArray.array.forEach(element => {
    console.log(element)
  })
}
