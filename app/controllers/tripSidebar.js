let saveTripTitle = function () {}

let addIndexRow = function (index) {
  let indexTable = document.getElementById('indexTableBody')
  let indexRow = document.createElement('tr')
  let indexCell = document.createElement('td')
  let destinationIndex = document.createTextNode(index)
  indexCell.appendChild(destinationIndex)
  indexRow.appendChild(indexCell)
  indexTable.appendChild(indexRow)
}

let addDestinationRow = function (destinationTitle) {
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

let addDestination = function (index, destinationTitle) {
  addIndexRow(index)
  addDestinationRow(destinationTitle)
}

document.getElementById('addButton').addEventListener('click', function () {
  addDestination(3, 'blah')
})

let saveItinerary = function () {
  let destInputs = []
  let destNames = []
  let destTable = document.getElementById('destinationsTable')
  for (let i = 0, rows; rows = destTable.rows[i]; i++) {
    let inputField = rows.cells[0].childNodes[0]
    let text = rows.cells[0].textContent
    destInputs.push(inputField.value)
    destNames.push(text)
  }
  console.log(destInputs)
  console.log(destNames)

  let itinerary = {
    'destInputs': destInputs,
    'destNames': destNames
  }

  $.ajax({
    url: '/tripSidebar/data',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(itinerary),
    success: function (res) {
    }
  })
}

let deleteDestination = function () {}
