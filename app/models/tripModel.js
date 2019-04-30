'use strict'

let db = require('./db')

let destInputsInt = []
let destNamesInt = []

let storeItinerary = function (itinerary, res) {
  db.saveTrip(itinerary, res)
  // // Initialize destination array
  // destInputsInt = []
  // // Store new destinations into destinations array
  // destInputs.forEach((dest) => {
  //   destInputsInt.push(dest)
  // })

  // // Initialize destination array
  // destNamesInt = []
  // // Store new place names into place name array
  // destNames.forEach((placeName) => {
  //   destNamesInt.push(placeName)
  // })
}

let getIntinerary = function () {
  return {
    'destInputs': destInputsInt,
    'destNames': destNamesInt
  }
}

let deleteDestination = function (destInput, destName) {
  destInputsInt = destInputsInt.filter((value, index, array) => {
    return value !== destInput
  })
  destNamesInt = destNamesInt.filter((value, index, array) => {
    return value !== destName
  })
}

module.exports = {
  storeItinerary,
  getIntinerary,
  deleteDestination
}
