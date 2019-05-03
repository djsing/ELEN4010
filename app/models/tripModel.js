'use strict'

function populateDestinationTable (trip, res) {
  let tripInfo = trip.body
  let queryString = ''
  for (let i = 0; i < tripInfo.destinationList.length; i++) {
    queryString = queryString + `INSERT INTO destinations VALUES(
      '${tripInfo.destinationList[i].id}',
      '${tripInfo.destinationList[i].name}',
      '${tripInfo.destinationList[i].place}',
      '${tripInfo.destinationList[i].latLng}',
      '${tripInfo.destinationList[i].placeId}',
      '${tripInfo.destinationList[i].order}',
      '${tripInfo.id}')
      ;`
  }
  console.log(queryString)
}

module.exports = {
  populateDestinationTable: populateDestinationTable
}
