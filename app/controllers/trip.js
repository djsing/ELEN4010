'use strict'

const $ = window.$
// ----------
// Classes
// -----------
class Destination {
  constructor (id, lat, lng, placeId, place, name, ordering) {
    this.id = String(id)
    this.lat = Number(lat())
    this.lng = Number(lng())
    this.placeId = String(placeId)
    this.place = String(place)
    this.name = String(name)
    this.ordering = Number(ordering)
  }
}

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

// -------------------------
// Declare global variables
// --------------------------
let map, service
let newLog = []
let markersOnMap = []
let newTrip = new Trip((new Date()).getTime(), '', [], JSON.parse(window.sessionStorage.getItem('Hash')))
let startLocation = randomProperty(countries)
// let startLocation = randomLocation
// let startLocation = { center: { lat: 10, lng: 330 }, zoom: 2.8 }

// ----------------
// Logic Functions
// -----------------
function randomBetween (min, max) {
  if (min < 0) {
    return min + Math.random() * (Math.abs(min) + max)
  } else {
    return min + Math.random() * max
  }
}

function randomProperty (obj) {
  let keys = Object.keys(obj)
  return obj[ keys[ keys.length * Math.random() << 0 ] ]
}

let tripTitleisEmpty = function (tripTitle) {
  if (tripTitle === '') {
    return true
  } else {
    console.log('Trip title is ', tripTitle)
    return false
  }
}

// function randomLocation () {
//   return randomProperty(countries)
// }

function addLogEntry (eventCode) {
  /* Event codes:
    0: "created the trip"   <- Major
    1: "invited [NEWUSER] to the trip" <- Major
    2: "joined the trip"    <- Major
    3: "renamed the trip"
    4: "added a destination"
    5: "removed a destination"
    6: "rearranged the destinations"
    7: "renamed a destination"
    8: "removed all destinations"
    9: UNUSED
  */
  let id = String((new Date()).getTime())
  let userHash = JSON.parse(window.sessionStorage.getItem('Hash')) // Should we do a proper check?
  let code = eventCode
  let date = new Date().toISOString().slice(0, 19).replace('T', ' ')
  let importance = 0
  if (eventCode < 3) {
    importance = 1
  }
  let tripId = newTrip.id
  let logEvent = new LogEvent(id, userHash, code, date, importance, tripId)
  newLog.push(logEvent)
  // Debugging:
  // console.log('Event with ID ',
  //   logEvent.id, ': At ',
  //   logEvent.date, ', ',
  //   logEvent.userHash, ' performed event with code ',
  //   logEvent.code, '.')
  // if (logEvent.importance) {
  //   console.log('It was a major event')
  // } else {
  //   console.log('It was a minor event')
  // }
}

let addDestination = function (latLng, placeId, place) {
  let id = (new Date()).getTime()
  let name = ''
  let ordering = newTrip.destinationList.length + 1
  let newDestination = new Destination(id, latLng.lat, latLng.lng, placeId, place, name, ordering)
  newTrip.destinationList.push(newDestination)
  addLogEntry(4)
  saveTripToSessionStorage()
  $('#deleteDestinations').show()
}

function placeDestinationBySearch (place, marker) {
  if (!place.geometry) {
    // User entered the name of a Place that was not suggested or the Place Details request failed.
    window.alert("No details available for input: '" + place.name + "'")
    return
  }

  // If the place has a geometry, then present it on a map.
  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport)
  } else {
    map.setCenter(place.geometry.location)
    map.setZoom(16)
  }
  marker.setPosition(place.geometry.location)
  marker.setVisible(false)

  let placeId = place.place_id
  let placeName = place.name
  let label = String(newTrip.destinationList.length + 1)

  addMarker(place.geometry.location, placeName, label)
  addDestination(place.geometry.location, placeId, placeName)
  drawDestination(newTrip.destinationList[newTrip.destinationList.length - 1])
}

function placeDestinationByClick (latLng) {
  let request = {
    bounds: map.bounds * 1000000,
    location: latLng,
    rankBy: google.maps.places.RankBy.DISTANCE,
    type: ['regions', 'cities'],
    fields: ['name', 'formatted_address', 'place_id', 'geometry']
  }

  let destinationName = 'Destination'
  let placeId = ''
  service = new google.maps.places.PlacesService(map)
  service.nearbySearch(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // ToDo some checks for valid info here, sort and process for sensible name
      destinationName = results[0].name
      placeId = results[0].place_id
    }

    let placeName = destinationName
    let label = String(markersOnMap.length + 1)

    addMarker(latLng, placeName, label)
    addDestination(latLng, placeId, placeName)
    drawDestination(newTrip.destinationList[newTrip.destinationList.length - 1])
    map.panTo(latLng)
  })
}
// --- End of Logic Functions ---

// ------------------
// Interface Methods
// ------------------
let drawDestination = function (dest) {
  let row = document.createElement('tr')
  row.id = dest.id
  row.className = 'destinationsTableRow'

  let destNum = document.createElement('td')
  destNum.innerHTML = String(dest.ordering)
  destNum.classList.add('indexClass')
  destNum.setAttribute('style', 'width: 10%; vertical-align: middle; float: left; padding-top: 30px; padding-left: 1px; font-size: 1.2rem;')
  row.appendChild(destNum)

  let destPlaceCell = document.createElement('td')
  destPlaceCell.classList.add('destinationClass')
  destPlaceCell.setAttribute('style', 'width: 80%')

  let destInput = document.createElement('input')
  destInput.className = 'destinationInputClass'
  destInput.setAttribute('style', 'font-size: 1rem; padding: 0.5rem 0rem;background-color: #fff0;')
  destInput.type = 'text'
  destInput.setAttribute('placeholder', 'Destination name...')
  if (dest.name !== '') {
    destInput.setAttribute('value', dest.name)
  }

  let destLabel = document.createElement('label')
  destLabel.classList.add('destinationLabelClass')
  // destLabel.setAttribute('style', 'font-size: 0.75rem;color: #aaa;')

  destLabel.innerHTML = dest.place
  destPlaceCell.appendChild(destInput)
  destPlaceCell.appendChild(destLabel)

  row.appendChild(destPlaceCell)

  let deleteButtonCell = document.createElement('td')
  deleteButtonCell.className = 'deleteClass'
  deleteButtonCell.setAttribute('style', 'width: 10%')

  let deleteButton = document.createElement('i')
  deleteButton.type = 'button'
  deleteButton.value = ''
  deleteButton.id = 'deleteButton'
  deleteButton.className = 'fas'
  deleteButton.classList.add('fa-trash-alt')
  deleteButton.setAttribute('style', 'float: right; position: relative; top: 20px; right: 5px; cursor: pointer; font-size: 1.5rem;')

  deleteButtonCell.appendChild(deleteButton)

  row.appendChild(deleteButtonCell)
  document.getElementById('destinationTable').appendChild(row)
}

function addMarker (latLng, placeName, label) {
  let marker = new google.maps.Marker({
    position: latLng,
    map: map,
    label: label
  })
  markersOnMap.push(marker)
}

let clearMarkers = function () {
  for (let i = 0; i < markersOnMap.length; i++) {
    markersOnMap[i].setMap(null)
  }
  markersOnMap = []
}

let renderMarkers = function () {
  for (let j = 0; j < newTrip.destinationList.length; j++) {
    let latLng = {
      lat: Number(newTrip.destinationList[j].lat),
      lng: Number(newTrip.destinationList[j].lng)
    }
    let marker = new google.maps.Marker({
      position: latLng,
      map: map,
      label: String(newTrip.destinationList[j].ordering)
    })
    markersOnMap.push(marker)
  }
}
// --- End of Interface Methods ---

// ------------------------
// Main Map Callback
// ------------------------
function initMap () {
  let styledSilverMapType = new google.maps.StyledMapType((silverMapType), { name: 'Light' })
  let styledDarkMapType = new google.maps.StyledMapType((darkMapType), { name: 'Dark' })

  map = new google.maps.Map(document.getElementById('map'), {
    center: startLocation.center,
    zoom: startLocation.zoom,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.BOTTOM_CENTER,
      mapTypeIds: ['roadmap', 'satellite', 'styled_map'] // 'hybrid', 'terrain',
    },
    panControl: false,
    zoomControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    draggableCursor: 'default'
    // mapTypeId: 'styled_map'
  })

  map.setTilt(45)
  map.mapTypes.set('styled_map', styledSilverMapType)
  map.setMapTypeId('styled_map')

  let card = document.getElementById('pac-card')
  let input = document.getElementById('pac-input')
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card)
  let autocomplete = new google.maps.places.Autocomplete(input)

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map)

  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(
    ['address_components', 'geometry', 'icon', 'name'])

  let marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, 0)
  })

  map.addListener('click', function (e) {
    marker = new google.maps.Marker({
      position: e.latLng,
      map: map
    })
    marker.setVisible(false)
    placeDestinationByClick(e.latLng, map)
  })

  autocomplete.addListener('place_changed', function () {
    marker.setVisible(true)
    let place = autocomplete.getPlace()
    placeDestinationBySearch(place, marker)
  })
}
// --- End of Main Map Callback ---

// ------------------------
// JQuery Event Listeners
// ------------------------

// destinations can be rearranged
$(document).ready(() => {
  $('#destinationTable').sortable({
    scroll: true,
    update: function (event, ui) {
      $('.destinationsTableRow .indexClass').each(function (i) {
        let numbering = i + 1
        $(this).text(numbering)
        for (let j = 0; j < newTrip.destinationList.length; j++) {
          if (Number(newTrip.destinationList[j].id) === Number($(this)[0].parentNode.id)) {
            newTrip.destinationList[j].ordering = Number(numbering)
          }
        }
      })
      // Sort by ordering to keep things sane
      newTrip.destinationList.sort((a, b) => (a.ordering > b.ordering) ? 1 : -1)
      clearMarkers()
      renderMarkers()
      addLogEntry(6)
      saveTripToSessionStorage()
    }
  })
})

// Delete a destination from the itinerary
$(document).on('click', '#deleteButton', function (e) {
  let id = $(this).parents('tr')[0].id
  $(this).parents('tr').remove()
  let i = newTrip.destinationList.length
  // Remove the destination from the Trip, using the shared ID between
  // the 'tr' element and the destination object in the list
  while (i--) {
    if (Number(newTrip.destinationList[i].id) === Number(id)) {
      newTrip.destinationList.splice(i, 1)
    }
  }
  for (let j = newTrip.destinationList.length - 1; j >= 0; j--) {
    newTrip.destinationList[j].ordering = Number(j + 1)
    $('.destinationsTableRow .indexClass').each(function (k) {
      let numbering = k + 1
      $(this).text(numbering)
    })
  }
  clearMarkers()
  renderMarkers()
  addLogEntry(5)
  saveTripToSessionStorage()
  if (newTrip.destinationList.length < 1) {
    $('#deleteDestinations').hide()
  }
})

// Click on a destination label in the trip itinerary
$(document).on('click', '.destinationLabelClass', function (e) {
  let id = $(this).parents('tr')[0].id
  let dest = newTrip.destinationList.find(function (obj) { return Number(obj.id) === Number(id) })
  let latLng = {
    lat: dest.lat,
    lng: dest.lng
  }
  map.panTo(latLng)
  map.setZoom(16)
})

// Trash all destinations
$(document).on('click', '#deleteDestinations', function () {
  clearMarkers()
  $('#destinationTable').empty()
  newTrip.destinationList = []
  addLogEntry(8)
  saveTripToSessionStorage()
  $('#deleteDestinations').hide()
})

// Pop-up saved confirmation alert
$(document).ready(() => {
  $('#success-alert').hide()
})

// Save Trip name upon input change
$(document).on('change paste', '#tripNameFormInput', function () {
  let name = document.getElementById('tripNameFormInput').value
  newTrip.title = name
  addLogEntry(3)
  saveTripToSessionStorage()
})

// Save Destination name upon input change
$(document).on('change paste', '.destinationInputClass', function () {
  let id = $(this).parents('tr')[0].id
  for (let j = 0; j < newTrip.destinationList.length; j++) {
    if (Number(newTrip.destinationList[j].id) === Number(id)) {
      newTrip.destinationList[j].name = this.value
    }
  }
  addLogEntry(7)
  saveTripToSessionStorage()
})

// upon page reload, this function is called
function renderOnReload () {
  $('#deleteDestinations').hide()
  if (window.sessionStorage.getItem('trip') !== null) {
    getTripFromSessionStorage()
    for (let i = 0; i < newTrip.destinationList.length; i++) {
      drawDestination(newTrip.destinationList[i])
    }
    renderMarkers()
    let bounds = new google.maps.LatLngBounds()
    if (newTrip.destinationList.length < 1) {
    } else {
      $('#deleteDestinations').show()
      for (let i = 0; i < markersOnMap.length; i++) {
        bounds.extend(markersOnMap[i].getPosition())
      }
      map.fitBounds(bounds)
    }
  }
}

// ----------------------- Trip Invites ----------------------------------

$(document).on('click', '#inviteEditorButton', function () {
  createInvitePopup()
  // Show the model popup
  $('.modal').show()
})

$(document).on('click', '.close', function () {
  let modalBox = $('div.modal')
  modalBox.className = 'modal fade in modal-body modal-dialog'
  modalBox.hide()
})

$(document).on('click', '#inviteEmailAddressButton', function () {
  let emailAddressField = $('#emailAddressField')
  let emailAddress = emailAddressField.val()

  // Validate the email address
  // If it's valid, proceed to post it, if not, clear the field and warn the user
  if (!isValidEmail(emailAddress)) {
    // Clear the input field
    emailAddressField.val('')
    // Tell the user that an invalid email address has been entered
    $('#invalidEmailMessage').hide()
    $('#invalidEmailMessage').show('slow')
  } else {
    // Send the email address to the back-end server
    let inviteeUsername = $('#usernameTag').text()

    let inviteInfo = {
      'tripID': newTrip.id.toString(),
      'tripName': newTrip.title.toString(),
      'emailAddress': emailAddress.toString(),
      'invitee': inviteeUsername
    }
    $.ajax({
      url: '/invite',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(inviteInfo),
      success: function (res) {
        // Display to user that an invite has been sent to the desired email address
        displayInviteSentMessage(emailAddress)
      }
    })
  }
})

let displayInviteSentMessage = function (emailAddress) {
  // Empty the modal box
  let modalBox = $('div.modal')
  modalBox.empty()

  // Add the exit button
  let exitButtonArea = $('<span class="close">&times;</span>')
  modalBox.append(exitButtonArea)

  // Create invite sent header
  let headerMessage = $('<h1 class="modal-element" id="inviteSendHeader">')
  headerMessage.text('Group invite sent to:')
  modalBox.append(headerMessage)

  // Display email address
  let emailAddressText = $('<p class="modal-element" id="InviteEmailAddress"> ' + emailAddress + ' </p>')
  modalBox.append(emailAddressText)
}

let createInvitePopup = function () {
  // Clear the existing modal area
  $('#modalArea').empty()

  // Create modal div
  let modalDiv = $('<div class="modal"></div>')
  $('#modalArea').append(modalDiv)

  // Add the exit button
  let exitButtonArea = $('<span class="close ">&times;</span>')
  modalDiv.append(exitButtonArea)

  // Add header
  let header = $('<h1> Invite A Group Member </h1>')
  modalDiv.append(header)

  // Add prompt text
  // let promptText = $('<p class="modal-element">Please type in the email address of a desired group member</p>')
  // modalDiv.append(promptText)

  // let promptText = $('<label for="emailAddressField">Email of desired group member</label>')
  // modalDiv.append(promptText)

  // Add email field
  let emailField = $('<input class="modal-element form-control" autocomplete="email" type="text" id="emailAddressField" placeholder="Email of desired group member">')
  modalDiv.append(emailField)

  // Add invite button
  let inviteButton = $('<input class="modal-element btn btn-md btn-primary" type="button" value="Invite" id="inviteEmailAddressButton">')
  modalDiv.append(inviteButton)

  // Add invalid email message
  let invalidEmailMessage = $('<p class="modal-element" id="invalidEmailMessage">The email address you have entered is invalid </p>')
  modalDiv.append(invalidEmailMessage)
}

let isValidEmail = function (emailAddress) {
  // See if the email conforms to regex for emails
  let regexForEmails = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm

  if (emailAddress === '' || !regexForEmails.test(emailAddress)) {
    return false
  }
  return true
}

// ------------------
// AJAX/Data Methods
// ------------------

// Save trip and log to DB with Save Trip button
$(document).on('click', '#saveTrip', function () {
  if (tripTitleisEmpty(newTrip.title)) {
    window.alert('This trip title has not been named.\n Please enter a title.')
  } else {
    saveTripToSessionStorage()
    $.ajax({
      url: '/trip/data',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newTrip),
      success: function (res) {
        $('#success-alert').fadeTo(2000, 500).slideUp(500, function () {
          $('#success-alert').slideUp(500)
        })
      }
    })
    $.ajax({
      url: '/trip-manager/data',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newTrip),
      success: function (res) {
        // console.log(res)
      }
    })
    $.ajax({
      url: '/trip/log',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newLog),
      success: function (res) {
        // console.log(res)
        newLog = []
      }
    })
  }
})

// ------------
// Data Methods
// -------------
function saveTripToSessionStorage () {
  newTrip.destinationList.sort((a, b) => (a.ordering > b.ordering) ? 1 : -1)
  window.sessionStorage.setItem('trip', JSON.stringify(newTrip))
}

function getTripFromSessionStorage () {
  newTrip = JSON.parse(window.sessionStorage.getItem('trip'))
  newTrip.destinationList.sort((a, b) => (a.ordering > b.ordering) ? 1 : -1)
  document.getElementById('tripNameFormInput').value = newTrip.title
}
