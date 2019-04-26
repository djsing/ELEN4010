let saveTripTitle = function () {}

let addDestination = function (index, destinationTitle) {
  let destinationsTable = document.getElementById('destinationsTableBody')
  let row = document.createElement('tr')
  let enumerationCell = document.createElement('td')
  let enumeration = document.createTextNode(index)
  enumerationCell.appendChild(enumeration)
  row.appendChild(enumerationCell)
  let destinationCell = document.createElement('td')
  let destination = document.createTextNode(destinationTitle)
  destinationCell.appendChild(destination)
  row.appendChild(destinationCell)
  let deleteButtonCell = document.createElement('td')
  let deleteButton = document.createElement('input')
  deleteButton.type = 'button'
  deleteButton.value = 'x'
  deleteButton.className = 'deleteButton'
  deleteButtonCell.appendChild(deleteButton)
  row.appendChild(deleteButtonCell)
  destinationsTable.appendChild(row)
}

document.getElementById('addButton').addEventListener('click', function () {
  addDestination(3, 'blah')
})

let saveTrip = function () {}

let deleteDestination = function () {}
