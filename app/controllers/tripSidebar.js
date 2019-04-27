let saveTripTitle = function () {}

let addDestination = function (index, destinationTitle) {
  let indexTable = document.getElementById('indexTableBody')
  let indexRow = document.createElement('tr')
  let indexCell = document.createElement('td')
  let destinationIndex = document.createTextNode(index)
  indexCell.appendChild(destinationIndex)
  indexRow.appendChild(indexCell)
  indexTable.appendChild(indexRow)

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
