let tripTitles = []

let saveTripTitle = function (tripTitle) {
  console.log(tripTitle)
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

module.exports = {
  saveTripTitle,
  getTripTitles,
  removeTrip
}
