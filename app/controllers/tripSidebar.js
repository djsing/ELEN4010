let saveTripTitle = function () {}

let addDestination = function (index, destinationTitle) {
  let numbersTable = document.getElementById('numbersTableBody')
  let numberRow = document.createElement('tr')
  let enumerationCell = document.createElement('td')
  let enumeration = document.createTextNode(index)
  enumerationCell.appendChild(enumeration)
  numberRow.appendChild(enumerationCell)
  numbersTable.appendChild(numberRow)

  let destinationsTable = document.getElementById('destinationsTableBody')
  let row = document.createElement('tr')
  let destinationCell = document.createElement('td')
  let destinationInput = document.createElement('input')
  destinationInput.placeholder = 'New Destination'
  destinationCell.appendChild(destinationInput)
  let destinationName = document.createTextNode(destinationTitle)
  destinationCell.appendChild(destinationName)
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
