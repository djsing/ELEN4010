'use strict'

let destInputsInt = []
let destNamesInt = []

let storeItinerary = function (destInputs, destNames) {
  // Initialize destination array
  destInputsInt = []
  // Store new destinations into destinations array
  destInputs.forEach((dest) => {
    destInputsInt.push(dest)
  })

  // Initialize destination array
  destNamesInt = []
  // Store new place names into place name array
  destNames.forEach((placeName) => {
    destNamesInt.push(placeName)
  })

  console.log(destInputsInt)
  console.log(destNamesInt)
}

let getIntinerary = function () {
  return {
    'destInputs': destInputsInt,
    'destNames': destNamesInt
  }
}

module.exports = {
  storeItinerary,
  getIntinerary
}
