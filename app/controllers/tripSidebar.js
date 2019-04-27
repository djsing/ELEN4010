let saveTripTitle = function () {}

let addIndexRow = function () {
  let indexTable = document.getElementById('indexTableBody')
  let index = indexTable.rows.length
  let indexRow = document.createElement('tr')
  let indexCell = document.createElement('td')
  let destinationIndex = document.createTextNode(index + 1)
  indexCell.appendChild(destinationIndex)
  indexRow.appendChild(indexCell)
  indexTable.appendChild(indexRow)
}

let addDestinationRow = function (destinationInput, destinationTitle) {
  let destinationsTable = document.getElementById('destinationsTableBody')
  let row = document.createElement('tr')
  let destinationCell = document.createElement('td')
  let destInput = document.createElement('input')
  destInput.placeholder = 'New Destination'
  destInput.value = destinationInput
  destinationCell.appendChild(destInput)
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

let addDestination = function (destinationInput, destinationTitle) {
  addIndexRow()
  addDestinationRow(destinationInput, destinationTitle)
}

document.getElementById('addButton').addEventListener('click', function () {
  addDestination('', 'destination name')
})

// upon page reload, this function is called
let initialiseItinerary = function () {
  $.ajax({
    url: '/tripSidebar/data',
    method: 'GET',
    contentType: 'application/json',
    success: (res) => {
      for (let i = 0; i < res.destInputs.length; i++) {
        addDestination(res.destInputs[i], res.destNames[i])
      }
    }
  })
}

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
