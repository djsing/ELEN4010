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

let addTitleDiplayField = function (title, row) {
  let newEntry = document.createElement('td')
  let titleDisplayField = document.createElement('input')
  titleDisplayField.id = title
  titleDisplayField.className = 'titleField'
  titleDisplayField.value = title
  titleDisplayField.disabled = true
  newEntry.appendChild(titleDisplayField)
  row.appendChild(newEntry)
}

let addEditBtnToTitle = function (title, row) {
  let newEntry = document.createElement('td')
  let newButton = document.createElement('input')
  newButton.type = 'button'
  newButton.value = 'Edit'
  newButton.className = 'editButton'
  newButton.id = title
  newEntry.appendChild(newButton)
  row.appendChild(newEntry)
}

let addDeleteBtnToTitle = function (title, row) {
  let newEntry = document.createElement('td')
  let newButton = document.createElement('input')
  newButton.type = 'button'
  newButton.value = 'Delete'
  newButton.className = 'deleteButton'
  newButton.id = title
  $('#title').on('click', () => {
    console.log('Delete button works')
  })
  row.appendChild(newButton)
}

let addTitleEntry = function (title) {
  let newRow = document.createElement('tr')
  addTitleDiplayField(title, newRow)
  addEditBtnToTitle(title, newRow)
  addDeleteBtnToTitle(title, newRow)
  $('#tripTitleTable').append(newRow)
}

let addSaveEditButton = function (tableCell) {
  let newButton = document.createElement('input')
  newButton.value = 'Save'
  newButton.type = 'submit'
  newButton.className = 'saveEdit'
  newButton.addEventListener('click', () => {
    console.log('Save button works')
  })
  tableCell.append(newButton)
}

$(function () {
  $(window).on('load', () => {
    $.ajax({
      url: '/trips/data',
      method: 'GET',
      contentType: 'application/json',
      data: JSON.stringify({ 'tripTitle': tripTitle }),
      success: function (res) {
        $('#tripTitleTable').empty()
        res.tripTitles.forEach((title) => {
          addTitleEntry(title)
        })
      }
    })
  })

  $('#addButton').click(() => {
    addTitleInputField()
    addSaveTripButton()
    $('#addButton').hide()
  })

  $('#newTrip').on('submit', (event) => {
    event.preventDefault()
    let tripTitle = $('#tripTitleInputField').val()
    $.ajax({
      url: '/trips/data',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ 'tripTitle': tripTitle }),
      success: function (res) {
        $('#tripTitleTable').empty()
        res.tripTitles.forEach((title) => {
          addTitleEntry(title)
        })
      }
    })
    $('#saveTripButton').remove()
    $('#tripTitleInputField').remove()
    $('#addButton').show()
  })

  $('table').on('click', '.deleteButton', function () {
    let oldRow = $(this).closest('tr')
    let titleInput = oldRow.find('input.titleField')
    let title = titleInput.val()
    $.ajax({
      url: '/trips/data',
      method: 'DELETE',
      contentType: 'application/json',
      data: JSON.stringify({ 'tripTitle': title }),
      success: function (res) {
      }
    })

    oldRow.remove()
  })

  $('table').on('click', '.editButton', function () {
    let oldRow = $(this).closest('tr')
    let titleInput = oldRow.find('input.titleField')
    titleInput.attr('disabled', false)

    let tableEntry = $(this).parent()
    tableEntry.empty()
    addSaveEditButton(tableEntry)
  })

  $('table').on('click', '.saveEdit', function () {
    let oldRow = $(this).closest('tr')
    let titleInput = oldRow.find('input.titleField')
    titleInput.attr('disabled', true)

    // let tableEntry = $(this).parent()
    // tableEntry.empty()
    // addSaveEditButton(tableEntry)
  })
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
