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

// ----------------
// Logic Functions
// -----------------
let tripTitleExists = function (tripTitle) {
  let trips = window.sessionStorage.getItem('tripList')
  if (trips.includes(tripTitle)) { return true } else { return false }
}

// ------------------
// Interface Methods
// ------------------
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

let addTitleEntry = function (title) {
  let newRow = document.createElement('tr')
  addTitleDiplayField(title, newRow)
  addEditBtnToTitle(title, newRow)
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
      for (let i = 0; i < res.length; i++) {
        addTitleEntry(res[i].title)
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
    let oldRow = $(this).closest('tr')[0].firstChild.firstChild.attributes['id'].nodeValue
    let tripsList = JSON.parse(window.sessionStorage.getItem('tripList'))
    let tripListTitle = []
    for (let i = 0; i < tripsList.length; i++) {
      tripListTitle.push(tripsList[i].title)
    }
    let index = $.inArray(oldRow, tripListTitle)
    $.ajax({
      url: '/trip-manager-interface/data',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ tripId: tripsList[index].id }),
      success: function (res) {
        let newTrip = {
          'id': Number(tripsList[index].id),
          'title': tripsList[index].title,
          'destinationList': res,
          'user': JSON.parse(window.sessionStorage.getItem('Hash'))
        }
        window.sessionStorage.setItem('trip', JSON.stringify(newTrip))
        window.location = '/trip'
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

// -------------------------- Trip Invites  ---------------------------------------
// let pendingTrips = [{ 'title': 'Malawi', 'tripID': '000001' }]

let displayInvites = function (pendingInvites) {
  // Clear the old table
  $('#invitesTable').empty()

  // Display the heading if there are pendingInvites
  if (pendingInvites.length > 0) {
    // Display the heading if there are pendingInvites

    $('#pendingTripInvitesHeading').show()

    pendingInvites.forEach((title) => {
      appendTripInvite(title)
    })
  } else {
    // Hide the heading if there are pendingInvites
    $('#pendingTripInvitesHeading').hide()
  }
}

let appendTripInvite = function (tripName) {
  let invitesTable = $('#invitesTable')
  let newRow = document.createElement('tr')

  // Add an entry for the name of the trip
  let nameEntry = document.createElement('td')
  nameEntry.innerHTML = tripName
  newRow.append(nameEntry)

  // Add an accept button for the invite
  let acceptBtn = document.createElement('button')
  acceptBtn.class = 'acceptButton'
  acceptBtn.innerHTML = 'accept'
  let acceptBtnCell = document.createElement('td')
  acceptBtnCell.append(acceptBtn)
  newRow.append(acceptBtnCell)

  // Add a reject button for the invite
  let rejectBtn = document.createElement('button')
  rejectBtn.class = 'rejectButton'
  rejectBtn.innerHTML = 'reject'
  let rejectBtnCell = document.createElement('td')
  rejectBtnCell.append(rejectBtn)
  newRow.append(rejectBtnCell)

  // Add row to table
  invitesTable.append(newRow)
}
