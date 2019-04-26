let saveTripTitle = function () {}

let addDestination = function () {
  let destinationsTable = document.getElementById('destinationsTableBody')
  let row = document.createElement('tr')
  let enumerationCell = document.createElement('td')
  let enumeration = document.createTextNode('1')
  enumerationCell.appendChild(enumeration)
  row.appendChild(enumerationCell)
  let destinationCell = document.createElement('td')
  let destination = document.createTextNode('some place')
  destinationCell.appendChild(destination)
  row.appendChild(destinationCell)
  destinationsTable.appendChild(row)
}

let saveTrip = function () {}
