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

function lookUpEventCode (entryCode) {
  switch (entryCode) {
    case 0:
      return 'created the trip'
    case 1:
      let str = 'invited a new member to join the trip'
      return str
    case 2:
      return 'joined the trip'
    case 3:
      return 'renamed the trip'
    case 4:
      return 'added a destination'
    case 5:
      return 'removed a destination'
    case 6:
      return 'rearranged the destinations'
    case 7:
      return 'renamed a destination'
    case 8:
      return 'removed all destinations'
    default:
      return 'unknown event'
  }
}

// Log rows
let addLogElements = function (logEntry, row) {
  let newElementDate = document.createElement('td')
  newElementDate.innerHTML = logEntry.date.slice(0, 10)

  let newElementTime = document.createElement('td')
  newElementTime.innerHTML = logEntry.date.slice(11, 19)

  let newElementUser = document.createElement('td')
  newElementUser.innerHTML = logEntry.userId
  let name = getUserName(logEntry.userId)
  name = JSON.parse(window.sessionStorage.getItem('name'))
  console.log(name)
  newElementUser.innerHTML = name

  let newElementEvent = document.createElement('td')
  newElementEvent.innerHTML = lookUpEventCode(logEntry.code)

  row.appendChild(newElementDate)
  row.appendChild(newElementTime)
  row.appendChild(newElementUser)
  row.appendChild(newElementEvent)
}

let addLogLineEntry = function (logEntry) {
  let newRow = document.createElement('tr')
  newRow.id = logEntry.id
  newRow.className = 'log-row'
  addLogElements(logEntry, newRow)
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

  // ---------- Trip Invites --------------------------

  let emailAddress = '1364103@students.wits.ac.za'
  $.ajax({
    url: '/invites/data',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ 'emailAddress': emailAddress }),
    success: function (res) {
      displayInvites(res)
    }
  })
})

let getUserName = function (id) {
  $.ajax({
    url: '/trip-manager/user',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ hash: id }),
    success: function (res) {
      let firstName = String(res[0].first_name)
      let lastName = String(res[0].last_name)
      let name = firstName + ' ' + lastName
      window.sessionStorage.setItem('name', JSON.stringify(name))
    }
  })
}

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

  $('#hide-log').click(() => {
    $('#trip-log').hide()
  })

  // view the trip log
  $('table').on('click', '.logButton', function () {
    log = []
    $('#logTable').empty()
    let id = $(this).parents('tr')[0].id
    let index = -1
    for (let i = 0; i < tripsList.length; i++) {
      if (Number(tripsList[i].id) === Number(id)) {
        index = i
      }
    }
    $('#trip-log').show()
    window.location = '/trip-manager#log-jump'
    $('#trip-log-title').html(tripsList[index].title)
    $.ajax({
      url: '/trip-manager/log',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ tripId: id }),
      success: function (log) {
        log.sort((a, b) => (a.date > b.date) ? 1 : -1)
        window.sessionStorage.setItem('log', JSON.stringify(log))
        log = JSON.parse(window.sessionStorage.getItem('log'))
        for (let i = 0; i < log.length; i++) {
          addLogLineEntry(log[i])
        }
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
  // Add event listeners for buttons for rejecting tripsss

  $(document).on('click', '.acceptButton', () => {
    console.log('An accept button was pressed')
  })

  $('[data-toggle="tooltip"]').tooltip()
})

$(document).on('click', '#rejectButton', function (e) {
  let id = $(this).parents('tr')[0].id
  $(this).parents('tr').remove()
})
// -------------------------- Trip Invites  ---------------------------------------
let pendingTrips = []

let displayInvites = function (pendingInvites) {
  // Clear the old table
  pendingTrips = pendingInvites
  $('#invitesTable').empty()

  // Display the heading if there are pendingInvites
  if (pendingInvites.length > 0) {
    // Display the heading if there are pendingInvites

    $('#pendingTripInvitesHeading').show()

    pendingInvites.forEach((invite) => {
      appendTripInvite(invite)
    })
  } else {
    // Hide the heading if there are pendingInvites
    $('#pendingTripInvitesHeading').hide()
  }
}

let appendTripInvite = function (trip) {
  let invitesTable = $('#invitesTable')
  let newRow = document.createElement('tr')

  // Add an entry for the name of the trip
  let nameEntry = document.createElement('td')
  nameEntry.innerHTML = trip.title
  newRow.append(nameEntry)

  // Add an accept button for the invite
  let acceptBtn = document.createElement('button')
  acceptBtn.className = 'acceptButton'
  acceptBtn.classList.add('btn', 'btn-sm', 'btn-secondary')
  acceptBtn.innerHTML = '<i class="fas fa-check"></i>'
  let acceptBtnCell = document.createElement('td')
  acceptBtnCell.appendChild(acceptBtn)
  newRow.appendChild(acceptBtnCell)

  // Add a reject button for the invite
  let rejectBtn = document.createElement('button')
  rejectBtn.id = 'rejectButton'
  rejectBtn.innerHTML = '<i class="fas fa-times"></i>'
  rejectBtn.classList.add('btn', 'btn-sm', 'btn-secondary')
  let rejectBtnCell = document.createElement('td')
  rejectBtnCell.appendChild(rejectBtn)
  newRow.appendChild(rejectBtnCell)

  // Add row to table
  newRow.id = trip.id
  invitesTable.append(newRow)
}
