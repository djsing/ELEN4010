let addTitleInputField = function () {
  let titleInputField = document.createElement('input')
  titleInputField.type = 'text'
  titleInputField.id = 'tripTitleInputField'
  $('#tripTitle').append(titleInputField)
}

let addSaveTripButton = function () {
  let savetripButton = document.createElement('input')
  savetripButton.type = 'submit'
  savetripButton.value = 'Save'
  savetripButton.id = 'saveTripButton'
  $('#tripTitle').append(savetripButton)
}

$(document).ready(() => {
  $('#addButton').click(() => {
    addTitleInputField()
    addSaveTripButton()
    $('#addButton').hide()
  })

  $('#newTrip').on('submit', (event) => {
    event.preventDefault()
    let tripTitle = $('tripTitleInputField').val()
    $.ajax({
      url: '/trips/data',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ tripTite: tripTitle }),
      success: function (res) {
        res.tripTitles.forEach((title) => {
          let newRow = document.createElement('tr')
          // Title entry
          let newEntry = document.createElement('td')
          let titleDisplayField = document.createElement('input')
          titleDisplayField.id = tripTitle
          titleDisplayField.value = title
          titleDisplayField.disabled = true

          newEntry.appendChild(titleDisplayField)
          newRow.appendChild(newEntry)
          $('#tripTitleTable').append(newRow)
        })
      }
    })
  })

  $('#saveTripButton').remove()
  $('#tripTitleInputField').remove()
  $('#addButton').show()
})

/*
let deleteButtons = document.getElementsByClassName('DeleteButtonClass')

let addTripTitle = function () {
  let input = document.createElement('input')
  input.type = 'text'
  input.name = 'tripTitleInput'
  let tripsList = document.getElementById('tripsList')
  tripsList.appendChild(input)
  document.getElementById('saveButton').hidden = false
  document.getElementById('addButton').disabled = true
}

let saveTripTitle = function () {
  document.getElementById('saveButton').hidden = true
  document.getElementById('editButton').hidden = false
  document.getElementById('deleteButton').hidden = false
}

let removeRow = function (buttonElem) {
  let row = buttonElem.parentNode.parentNode
  row.parentNode.removeChild(row)
}

let editTitle = function (editButtonName, inputElemName, tripTitle) {
  document.getElementById(inputElemName).disabled = false
  // create save button
  let editButton = document.getElementById(editButtonName)
  editButton.parentNode.appendChild(createSaveButton(tripTitle, inputElemName))
  editButton.parentNode.removeChild(editButton)
}

let createSaveButton = function (tripTitle, inputElemName) {
  let saveButton = document.createElement('Input')
  saveButton.value = 'Save'
  saveButton.type = 'submit'
  saveButton.id = tripTitle + 'Save'
  saveButton.addEventListener('click', () => {
    // Make the trip title to not be editable
    let inputElem = document.getElementById(inputElemName)
    inputElem.disabled = true
    inputElem.id = inputElem.value + 'Input'

    // Remove the save button and put an edit button there instead
    saveButton.parentNode.appendChild(createEditButton(tripTitle, inputElem.id))
    saveButton.parentNode.removeChild(saveButton)
  })
  return saveButton
}

let createEditButton = function (tripTitle, inputElemName) {
  let editButton = document.createElement('Input')
  editButton.type = 'button'
  editButton.value = 'Edit'
  editButton.id = tripTitle + 'Edit'
  editButton.addEventListener('click', () => {
    editTitle(editButton.id, inputElemName, tripTitle)
  })

  return editButton
}
*/
