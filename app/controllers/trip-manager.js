'use strict'

const $ = window.$
let trips = []

class Trip {
  constructor () {
    this.title = ''
    this.destinationList = []
    this.id = (new Date()).getTime()
  }
}

function saveToLocal () {
  window.localStorage.setItem('trips', JSON.stringify(trips))
}

function getFromLocal () {
  let temp = JSON.parse(window.localStorage.getItem('trips'))
  if (temp === null) { trips = [] } else { trips = temp }
}

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

// let addDeleteBtnToTitle = function (title, row) {
//   let newEntry = document.createElement('td')
//   let newButton = document.createElement('input')
//   newButton.type = 'button'
//   newButton.value = 'Delete'
//   newButton.className = 'deleteButton'
//   newButton.id = title
//   $('#title').on('click', () => {
//   })
//   row.appendChild(newButton)
// }

let addTitleEntry = function (title) {
  let newRow = document.createElement('tr')
  addTitleDiplayField(title, newRow)
  addEditBtnToTitle(title, newRow)
  $('#tripTitleTable').append(newRow)
}

$(function () {
  $(document).ready(() => {
    getFromLocal()
    for (let i = 0; i < trips.length; i++) {
      let tripTitle = trips[i].title
      addTitleEntry(tripTitle)
    }
  })

  $('#addButton').click(() => {
    addTitleInputField()
    addSaveTripButton()
    $('#addButton').hide()
  })

  $('#newTrip').on('submit', (event) => {
    event.preventDefault()
    let tripTitle = $('#tripTitleInputField').val()
    let newTrip = new Trip()
    addTitleEntry(tripTitle)
    newTrip.title = tripTitle
    trips.push(newTrip)
    saveToLocal()

    $.ajax({
      url: '/trip-manager/data',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newTrip),
      success: function (res) {
      }
    })

    $('#saveTripButton').remove()
    $('#tripTitleInputField').remove()
    $('#addButton').show()
  })
})

// $('table').on('click', '.deleteButton', function () {
//   let oldRow = $(this).closest('tr')
//   let titleInput = oldRow.find('input.titleField')
//   let title = titleInput.val()
//   $.ajax({
//     url: '/trip-manager/data',
//     method: 'DELETE',
//     contentType: 'application/json',
//     data: JSON.stringify({ 'tripTitle': title }),
//     success: function (res) {
//       $('#tripTitleTable').empty()
//       res.tripTitles.forEach((title) => {
//         addTitleEntry(title)
//       })
//     }
//   })

//   oldRow.remove()
// })

// $('table').on('click', '.editButton', function () {
//   let oldRow = $(this).closest('tr')
//   let titleInput = oldRow.find('input.titleField')
//   titleInput.attr('disabled', false)

//   let tableEntry = $(this).parent()
//   tableEntry.empty()
//   addSaveEditButton(tableEntry)
// })

// $('table').on('click', '.saveEdit', function () {
//   let oldRow = $(this).closest('tr')
//   let titleInput = oldRow.find('input.titleField')
//   let oldTripTitle = titleInput.attr('id')
//   let newTripTitle = titleInput.val()
//   titleInput.attr('disabled', true)

//   $.ajax({
//     url: '/trip-manager/data',
//     method: 'PUT',
//     contentType: 'application/json',
//     data: JSON.stringify({ 'oldTripTitle': oldTripTitle,
//       'newTripTitle': newTripTitle }),
//     success: function (res) {
//       $('#tripTitleTable').empty()
//       res.tripTitles.forEach((title) => {
//         addTitleEntry(title)
//       })
//     }
//   })

//   let tableEntry = $(this).parent()
//   tableEntry.empty()
//   addEditButton(newTripTitle, tableEntry)
// })
