'use strict'

const $ = window.$

class Trip {
  constructor () {
    this.title = ''
    this.user = JSON.parse(window.sessionStorage.getItem('Hash'))
    this.id = (new Date()).getTime()
  }
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

let tripTitleExists = function (tripTitle) {
  let trips = window.sessionStorage.getItem('tripList')
  if (trips.includes(tripTitle)) { return true } else { return false }
}

$(function () {
  $(document).ready(() => {
    $.ajax({
      url: '/trip-manager/get-data',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ userHash: window.sessionStorage.getItem('Hash') }),
      success: function (res) {
        window.sessionStorage.setItem('tripList', JSON.stringify(res))
        for (let i = 0; i < res.length; i++) {
          addTitleEntry(res[i].title)
        }
      }
    })
  })

  $('table').on('click', '.editButton', function () {
    let oldRow = $(this).closest('tr')[0].firstChild.firstChild.attributes['id'].nodeValue
    console.log(oldRow)
    let tripsList = JSON.parse(window.sessionStorage.getItem('tripList'))
    let tripListTitle = []
    for (let i = 0; i < tripsList.length; i++) {
      tripListTitle.push(tripsList[i].title)
    }
    let index = $.inArray(oldRow, tripListTitle)
    console.log(tripsList[index].id)
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
    newTrip.title = tripTitle

    if (tripTitleExists(tripTitle) === false) {
      $.ajax({
        url: '/trip-manager/data',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newTrip),
        success: function (res) {
          addTitleEntry(res.title)
          let currentTrips = JSON.parse(window.sessionStorage.getItem('tripList'))
          currentTrips.push({
            id: JSON.stringify(res.id),
            title: res.title })
          window.sessionStorage.setItem('tripList', JSON.stringify(currentTrips))
        }
      })

      $('#saveTripButton').remove()
      $('#tripTitleInputField').remove()
      $('#addButton').show()
    } else {
      window.alert('This trip title already exists.\n Please enter a new title.')
    }
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
