'use strict'

class Destination {
  constructor (latLng, place, order) {
    this.latLng = latLng
    this.id = (new Date()).getTime()
    this.place = place
    this.name = ''
    this.order = order
  }
}

class Trip {
  constructor () {
    this.title = ''
    this.user = JSON.parse(window.sessionStorage.getItem('Hash'))
    this.destinationList = []
    this.id = (new Date()).getTime()
  }
}

// Declare global variables
let map, service
let newTrip = new Trip()
let startLocation = randomProperty(countries)
// let startLocation = {
//   center: { lat: 10, lng: 330 },
//   zoom: 2.8
// }

function getTripTitle () {
  let title = document.getElementById('formGroupExampleInput')
  newTrip.title = title.value
}

function setTripTitle () {
  document.getElementById('formGroupExampleInput').value = newTrip.title
}

function saveToLocal () {
  getTripTitle()
  window.sessionStorage.setItem('trip', JSON.stringify(newTrip))
}

function getFromLocal () {
  newTrip = JSON.parse(window.sessionStorage.getItem('trip'))
  setTripTitle()
}

let addDestination = function (latLng, placeName) {
  let order = newTrip.destinationList.length + 1
  let newDestination = new Destination(latLng, placeName, order)
  newTrip.destinationList.push(newDestination)
  saveToLocal()
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

  let placeName = place.name
  let label = String(newTrip.destinationList.length + 1)
  addMarker(place.geometry.location, placeName, label)
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
  service = new google.maps.places.PlacesService(map)
  service.nearbySearch(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // ToDo some checks for valid info here, sort and process for sensible name
      destinationName = results[0].name
    }

    let placeName = destinationName
    let label = String(markersOnMap.length + 1)
    addMarker(latLng, placeName, label)
    map.panTo(latLng)
  })
}

function initMap () {
  let styledSilverMapType = new google.maps.StyledMapType((silverMapType), { name: 'Silver Map' })
  let styledDarkMapType = new google.maps.StyledMapType((darkMapType), { name: 'Dark Map' })

  map = new google.maps.Map(document.getElementById('map'), {
    center: startLocation.center,
    zoom: startLocation.zoom,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    draggableCursor: 'default',
    mapTypeId: 'styled_map'
    // mapTypeControlOptions: {
    //   mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
    // }
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

$(document).ready(function () {
  $('#destinationTable').sortable({
    scroll: true,
    update: function (event, ui) {
      let id
      $('.destinationsTableRow .indexClass').each(function (i) {
        let numbering = i + 1
        $(this).text(numbering)
        for (let j = 0; j < newTrip.destinationList.length; j++) {
          if (newTrip.destinationList[j].id === Number($(this)[0].parentNode.id)) {
            newTrip.destinationList[j].order = numbering
          }
        }
      })
      newTrip.destinationList.sort((a, b) => (a.order > b.order) ? 1 : -1)
      clearMarkers()
      renderMarkers()
      saveToLocal()
    }
  })
})

$(document).on('click', '#deleteButton', function (e) {
  let id = $(this).parents('tr')[0].id
  $(this).parents('tr').remove()
  let i = newTrip.destinationList.length
  while (i--) {
    if (newTrip.destinationList[i].id === Number(id)) {
      newTrip.destinationList.splice(i, 1)
    }
  }
  for (let j = newTrip.destinationList.length - 1; j >= 0; j--) {
    newTrip.destinationList[j].order = Number(j + 1)
    $('.destinationsTableRow .indexClass').each(function (k) {
      let numbering = k + 1
      $(this).text(numbering)
    })
  }
  clearMarkers()
  renderMarkers()
  saveToLocal()
  if (newTrip.destinationList.length < 1) {
    $('#deleteDestinations').hide()
  }
})

$(document).on('click', '.destinationClass', function (e) {
  let id = $(this).parents('tr')[0].id
  let dest = newTrip.destinationList.find(function (obj) { return obj.id === Number(id) })
  map.panTo(dest.latLng)
  map.setZoom(10)
  // markersOnMap[dest.order - 1].setAnimation(google.maps.Animation.BOUNCE)
})

$(document).on('click', '#deleteDestinations', function () {
  clearMarkers()
  $('#destinationTable').empty()
  newTrip.destinationList = []
  saveToLocal()
  $('#deleteDestinations').hide()
})

$(document).on('click', '#saveTrip', function () {
  saveToLocal()
  $.ajax({
    url: '/trip/data',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(newTrip),
    success: function (res) {
      console.log(res)
    }
  })
  $.ajax({
    url: '/trip-manager/data',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(newTrip),
    success: function (res) {
      console.log(res)
    }
  })
})

// upon page reload, this function is called
// let renderDestinations = function () {
//   $('#indexTableBody').empty()
//   $('#destinationsTableBody').empty()
//   $.ajax({
//     url: '/trip/data',
//     method: 'GET',
//     contentType: 'application/json',
//     success: (res) => {
//       for (let i = 0; i < res.destInputs.length; i++) {
//         drawDestination(res.destInputs[i], res.destNames[i])
//       }
//     }
//   })
// }
$(document).ready(function () {
  $('#success-alert').hide()
  $('#saveTrip').click(function showAlert () {
    $('#success-alert').fadeTo(2000, 500).slideUp(500, function () {
      $('#success-alert').slideUp(500)
    })
  })
})

$(document).change('#formGroupExampleInput', function () {
  saveToLocal()
})

// upon page reload, this function is called
function renderOnReload () {
  $('#deleteDestinations').hide()
  if (window.sessionStorage.getItem('trip') !== null) {
    getFromLocal()
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
  $('.modal').show('slow')
})

$(document).on('click', '.close', function () {
  let modalBox = $('div.modal')
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
  let emailAddressText = $('<p class="modal-element" id="emailAddress"> ' + emailAddress + ' </p>')
  modalBox.append(emailAddressText)
}

let createInvitePopup = function () {
  // Clear the existing modal area
  $('#modalArea').empty()

  // Create modal div
  let modalDiv = $('<div class="modal"></div>')
  $('#modalArea').append(modalDiv)

  // Add the exit button
  let exitButtonArea = $('<span class="close">&times;</span>')
  modalDiv.append(exitButtonArea)

  // Add header
  let header = $('<h1> Invite A Group Member </h1>')
  modalDiv.append(header)

  // Add prompt text
  let promptText = $('<p class="modal-element">Please type in the email address of a desired group member</p>')
  modalDiv.append(promptText)

  // Add email field
  let emailField = $('<input class="modal-element" type="text" id="emailAddressField">')
  modalDiv.append(emailField)

  // Add invite button
  let inviteButton = $('<input class="modal-element" type="button" value="Invite" id="inviteEmailAddressButton">')
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
