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

let updateTrip = function (tripTitle) {
  console.log('Updating trips')
}

module.exports = {
  saveTripTitle,
  getTripTitles,
  removeTrip,
  updateTrip
}
