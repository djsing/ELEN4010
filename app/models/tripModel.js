let tripTitles = []

let saveTripTitle = function (tripTitle) {
  tripTitles.push(tripTitle)
}

let getTripTitles = function () {
  return tripTitles
}

module.exports = {
  saveTripTitle,
  getTripTitles
}
