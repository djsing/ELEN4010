let tripTitles = []

let saveTripTitle = function (tripTitle) {
  tripTitles.push(tripTitle)
}

let getTripTitles = function () {
  tripTitles.sort()
  return tripTitles
}

let removeTrip = function (tripTitle) {
  tripTitles = tripTitles.filter((value, index, array) => {
    return value !== tripTitle
  })
}

module.exports = {
  saveTripTitle,
  getTripTitles,
  removeTrip
}
