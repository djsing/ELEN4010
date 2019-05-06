'use strict'

const $ = window.$

// ----------
// Classes
// -----------
class Trip {
  constructor (id, title, destinations, user) {
    this.id = id
    this.title = title
    this.destinationList = destinations
    this.user = user
  }
}

// --------------
// Globals
// --------------
let tripsList = []

// ----------------
// Logic Functions
// -----------------
// let tripTitleExists = function (tripTitle) {
//   let trips = window.sessionStorage.getItem('tripList')
//   if (trips.includes(tripTitle)) { return true } else { return false }
// }

// ------------------
// Interface Methods
// ------------------
let addTitleInputField = function () {
  let titleInputField = document.createElement('input')
  titleInputField.type = 'text'
  titleInputField.className = 'tripTitleInputField'
  $('#tripTitle').append(titleInputField)
}

let addSaveTripButton = function () {
  let savetripButton = document.createElement('input')
  savetripButton.type = 'submit'
  savetripButton.value = 'Save'
  savetripButton.className = 'saveTripButton'
  $('#tripTitle').append(savetripButton)
}

let addTitleDiplayField = function (title, row) {
  let newEntry = document.createElement('td')
  let titleDisplayField = document.createElement('input')
  // titleDisplayField.id = trip.id
  titleDisplayField.className = 'titleField'
  titleDisplayField.value = title
  titleDisplayField.disabled = true
  newEntry.appendChild(titleDisplayField)
  row.appendChild(newEntry)
}

let addEditBtnToTitle = function (row) {
  let newEntry = document.createElement('td')
  let newButton = document.createElement('input')
  newButton.type = 'button'
  newButton.value = 'Edit Trip'
  newButton.className = 'editButton'
  // newButton.id = trip.id
  newEntry.appendChild(newButton)
  row.appendChild(newEntry)
}

let addLogBtnToTitle = function (row) {
  let newEntry = document.createElement('td')
  let newButton = document.createElement('input')
  newButton.type = 'button'
  newButton.value = 'View Log'
  newButton.className = 'logButton'
  // newButton.id = title
  newEntry.appendChild(newButton)
  row.appendChild(newEntry)
}

let addTitleEntry = function (trip) {
  let newRow = document.createElement('tr')
  newRow.id = trip.id
  addTitleDiplayField(trip.title, newRow)
  addEditBtnToTitle(newRow)
  addLogBtnToTitle(newRow)
  $('#tripTitleTable').append(newRow)
}

// --------------------------------------------
// AJAX/Data Methods / JQuery Event Listeners
// --------------------------------------------

// On Document load, propogate a list of trips. This is quite slow at present, could we preload it somehow?
$(document).ready(() => {
  $.ajax({
    url: '/trip-manager/get-data',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ userHash: window.sessionStorage.getItem('Hash') }),
    success: function (res) {
      window.sessionStorage.setItem('tripList', JSON.stringify(res))
      tripsList = JSON.parse(window.sessionStorage.getItem('tripList'))
      for (let i = 0; i < res.length; i++) {
        addTitleEntry(tripsList[i])
        // addTitleEntry(res[i])
      }
    }
  })
})

$(function () {
  // Add trip button event
  $('#addButton').click(() => {
    addTitleInputField()
    addSaveTripButton()
    $('#addButton').hide()
  })

  // Edit an existing trip
  $('table').on('click', '.editButton', function () {
    let id = $(this).parents('tr')[0].id
    let index = -1
    for (let i = 0; i < tripsList.length; i++) {
      if (Number(tripsList[i].id) === Number(id)) {
        index = i
      }
      $.ajax({
        url: '/trip-manager-interface/data',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ tripId: id }),
        success: function (res) {
          let existingTrip = {
            'id': Number(id),
            'title': tripsList[index].title,
            'destinationList': res,
            'user': JSON.parse(window.sessionStorage.getItem('Hash'))
          }
          window.sessionStorage.setItem('trip', JSON.stringify(existingTrip))
          window.location = '/trip'
        }
      })
    }
  })

  // view the trip log
  // $('table').on('click', '.logButton', function () {
  //   let row = $(this).closest('tr')[0].firstChild.firstChild.attributes['id'].nodeValue
  //   let newLog = []
  //   let currentTrip = JSON.parse(window.sessionStorage.getItem(''))
  //   let index = $.inArray(row, tripListTitle)
  //   $.ajax({
  //     url: '/trip-manager-interface/log',
  //     method: 'POST',
  //     contentType: 'application/json',
  //     data: JSON.stringify({ tripId: tripsList[index].id }),
  //     success: function (res) {
  //       let existingTrip = {
  //         'id': Number(tripsList[index].id),
  //         'title': tripsList[index].title,
  //         'destinationList': res,
  //         'user': JSON.parse(window.sessionStorage.getItem('Hash'))
  //       }
  //     }
  //   })
  // })

  // Create a new trip
  $('#newTrip').on('submit', (event) => {
    event.preventDefault()
    let title = $('#tripTitleInputField').value
    console.log(title)
    let id = (new Date()).getTime()
    let user = JSON.parse(window.sessionStorage.getItem('Hash'))
    let newTrip = new Trip(id, title, [], user)
    // if (!tripTitleExists(title)) {
    $.ajax({
      url: '/trip-manager/data',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newTrip),
      success: function (res) {
        tripsList.push(newTrip)
        addTitleEntry(newTrip)
        // let currentTrips = JSON.parse(window.sessionStorage.getItem('tripList'))
        // currentTrips.push({
        //   id: JSON.stringify(res.id),
        //   title: res.title })
        window.sessionStorage.setItem('tripList', JSON.stringify(tripsList))
      }
    })
    $(function () {
      $('#saveTripButton').remove()
      $('#tripTitleInputField').remove()
      $('#addButton').show()
      $('#logButton').show()
    })
    // } else {
    //   window.alert('This trip title already exists.\n Please enter a new title.')
    // }
  })
})
