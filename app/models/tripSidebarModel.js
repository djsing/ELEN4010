'use strict'

let destNames = []
let placeNames = []

let storeItinerary = function (itinerary) {
  // Initialize destination array
  destNames = []
  // Store new destinations into destinations array
  itinerary.destNames.forEach((dest) => {
    destNames.push(dest)
  })

  // Initialize destination array
  placeNames = []
  // Store new place names into place name array
  itinerary.placeNames.forEach((placeName) => {
    placeNames.push(placeName)
  })
}

let getIntinerary = function () {
  return {
    'destNames': destNames,
    'placeNames': placeNames
  }
}
