'use strict'

let destInputs = []
let destNames = []

let storeItinerary = function (itinerary) {
  // Initialize destination array
  destInputs = []
  // Store new destinations into destinations array
  itinerary.destInput.forEach((dest) => {
    destInputs.push(dest)
  })

  // Initialize destination array
  destNames = []
  // Store new place names into place name array
  itinerary.destNames.forEach((placeName) => {
    destNames.push(placeName)
  })
}

let getIntinerary = function () {
  return {
    'destInputs': destInputs,
    'destNames': destNames
  }
}
