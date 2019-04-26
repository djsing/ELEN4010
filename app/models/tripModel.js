let tripTitles = []

let saveTripTitle = function (tripTitle) {
  tripTitles.push(tripTitle)
}

let getTripTitles = function () {
  tripTitles.sort()
  return { 'tripTitles': tripTitles }
}

let removeTrip = function (tripTitle) {
  tripTitles = tripTitles.filter((value, index, array) => {
    return value !== tripTitle
  })
}

let updateTrip = function (oldTripTitle, newTripTitle) {
  let index = tripTitles.findIndex((title) => { return title === oldTripTitle })
  tripTitles[index] = newTripTitle
}

module.exports = {
  saveTripTitle,
  getTripTitles,
  removeTrip,
  updateTrip
}
