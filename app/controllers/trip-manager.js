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
class LogEvent {
  constructor (id, userId, code, date, importance, tripId) {
    this.id = id
    this.userId = userId
    this.code = code
    this.date = date
    this.importance = importance
    this.tripId = tripId
  }
}

// --------------
// Globals
// --------------
let tripsList = []
let log = []

// ----------------
// Logic Functions
// -----------------
let tripTitleExists = function (tripTitle) {
  for (let i = 0; i < tripsList.length; i++) {
    if (tripsList[i].title === tripTitle) {
      return true
    }
  }
  return false
}

// ------------------
// Interface Methods
// ------------------

// Trip rows
let addTitleInputField = function () {
  let titleInputField = document.createElement('input')
  titleInputField.type = 'text'
  titleInputField.id = 'tripTitleInputField'
  $('#tripTitle').append(titleInputField)
}

let addSaveTripButton = function () {
  let savetripButton = document.createElement('Input')
  savetripButton.type = 'submit'
  savetripButton.value = 'Save'
  savetripButton.id = 'saveTripButton'
  savetripButton.classList.add('btn', 'btn-sm', 'btn-secondary')
  $('#tripTitle').append(savetripButton)
}

let addTitleDisplayField = function (title, row) {
  let newEntry = document.createElement('td')
  let titleDisplayField = document.createElement('input')
  titleDisplayField.id = title
  titleDisplayField.className = 'titleField'
  titleDisplayField.value = title
  titleDisplayField.setAttribute('readonly', '1')
  titleDisplayField.setAttribute('data-toggle', 'tooltip')
  titleDisplayField.setAttribute('title', 'Click to edit')
  newEntry.appendChild(titleDisplayField)
  row.appendChild(newEntry)
}

let addLogBtnToTitle = function (row) {
  let newEntry = document.createElement('td')
  let newButton = document.createElement('input')
  newButton.type = 'button'
  newButton.value = 'Log'
  newButton.className = 'logButton'
  newButton.classList.add('btn', 'btn-sm', 'btn-secondary')
  newButton.setAttribute('href', '#log-jump')
  newEntry.appendChild(newButton)
  row.appendChild(newEntry)
}

let addTitleEntry = function (trip) {
  let newRow = document.createElement('tr')
  newRow.id = trip.id
  addLogBtnToTitle(newRow)
  addTitleDisplayField(trip.title, newRow)
  $('#tripTitleTable').append(newRow)
}

// <tr id="log-row">
// <td id="log-date">when</td>
// <td id="log-time">around</td>
// <td id="log-user">who</td>
// <td id="log-event">what</td>

// this.id = id
// this.userId = userId
// this.code = code
// this.date = date
// this.importance = importance
// this.tripId = tripId

// Log rows
let addLogLine = function (logEntry, row) {
  let newEntryDate = document.createElement('td')
  let newEntryTime = document.createElement('td')
  let newEntryUser = document.createElement('td')
  let newEntryEvent = document.createElement('td')
  newEntryDate.value = logEntry.date
  newEntryTime.value = logEntry.date

  newEntry.appendChild(titleDisplayField)
  row.appendChild(newEntry)
}

let addLogEntry = function (logEntry) {
  let newRow = document.createElement('tr')
  newRow.className('log-row')
  newRow.id = logEntry.id
  addLogLine(logEntry, newRow)
  $('#logTable').append(newRow)
}

// --------------------------------------------
// AJAX/Data Methods / JQuery Event Listeners
// --------------------------------------------

// On Document load, propogate a list of trips. This is quite slow at present, could we preload it somehow?
$(document).ready(() => {
  $('#trip-log').hide()
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
      }
      $('#loader').remove()
    }
  })
})

// JQuery stuff
$(function () {
  // Add trip button event
  $('#addButton').click(() => {
    addTitleInputField()
    addSaveTripButton()
    $('#info-text').hide()
    $('#addButton').hide()
  })

  // Edit an existing trip
  $('table').on('click', '.titleField', function () {
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
          // Put the DB entries into Session Storage, then go to trip page
          window.sessionStorage.setItem('trip', JSON.stringify(existingTrip))
          window.location = '/trip'
        }
      })
    }
  })

  // view the trip log
  $('table').on('click', '.logButton', function () {
    let id = $(this).parents('tr')[0].id
    console.log('Row ID is', id)
    let index = -1
    for (let i = 0; i < tripsList.length; i++) {
      if (Number(tripsList[i].id) === Number(id)) {
        index = i
      }
    }
    console.log('Index is', index)
    $('#trip-log').show()
    window.location = '/trip-manager#log-jump'
    $('#trip-log-title').html(tripsList[index].title)
    $.ajax({
      url: '/trip-manager/log',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ tripId: id }),
      success: function (log) {
        console.log(log)
        window.sessionStorage.setItem('log', JSON.stringify(log))
        log = JSON.parse(window.sessionStorage.getItem('log'))
      }
    })
  })

  // Create a new trip
  $('#newTrip').on('submit', (event) => {
    event.preventDefault()
    let title = $('#tripTitleInputField').val()
    let id = (new Date()).getTime()
    let user = JSON.parse(window.sessionStorage.getItem('Hash'))
    let newTrip = new Trip(id, title, [], user)
    if (tripTitleExists(title) === false) {
      $.ajax({
        url: '/trip-manager/data',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newTrip),
        success: function (res) {
          addTitleEntry(newTrip)
          tripsList.push({
            id: JSON.stringify(id),
            title: title })
          window.sessionStorage.setItem('tripList', JSON.stringify(tripsList))
          tripsList = JSON.parse(window.sessionStorage.getItem('tripList'))
        }
      })

      $('#saveTripButton').remove()
      $('#tripTitleInputField').remove()
      $('#addButton').show()
      $('#logButton').show()
      $('#info-text').show()
    } else {
      window.alert('This trip title already exists.\n Please enter a new title.')
    }
  })

  $('[data-toggle="tooltip"]').tooltip()
})
