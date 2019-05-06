'use strict'

const $ = window.$

class Trip {
  constructor () {
    this.title = ''
    this.user = JSON.parse(window.sessionStorage.getItem('Hash'))
    this.destinationList = []
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
    $.ajax({
      url: '/trip-manager-interface/data',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ tripId: tripsList[index].id }),
      success: function (res) {
        let newTrip = {
          'title': tripsList[index].title,
          'user': JSON.parse(window.sessionStorage.getItem('Hash')),
          'destinationList': res,
          'id': tripsList[index].id
        }
        console.log('i get here ', res)
        console.log(newTrip)
        window.sessionStorage.setItem('trip', JSON.stringify(newTrip))
        window.location = '/trip'
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
  displayInvites()
})

// -------------------------- Trip Invites  ---------------------------------------
// let pendingTrips = [{ 'title': 'Malawi', 'tripID': '000001' }]
let pendingTrips = []

let displayInvites = function () {
  // Clear the old table
  $('#invitesTable').empty()

  // Display the heading if there are pendingInvites
  if (pendingTrips.length > 0) {
    // Display the heading if there are pendingInvites

    $('#pendingTripInvitesHeading').show()

    pendingTrips.forEach((trip) => {
      appendTripInvite(trip.title)
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
