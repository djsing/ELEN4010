'use strict'

const $ = window.$

class Destination {
  constructor (latLng, place, placeID, name, order, id) {
    this.latLng = latLng
    this.place = place
    this.placeID = placeID
    this.name = name
    this.order = order
    this.id = id
  }
}

class Trip {
  constructor (title, destinations, id) {
    this.title = title
    this.destinationList = destinations
    this.id = id
  }
}

// Declare global variables
let map, service
let newTrip = new Trip('', [], (new Date()).getTime())
let startLocation = randomProperty(countries)
// let startLocation = {
//   center: { lat: 10, lng: 330 },
//   zoom: 2.8
// }

function saveToSessionStorage () {
  window.sessionStorage.setItem('trip', JSON.stringify(newTrip))
}

function getFromSessionStorage () {
  newTrip = JSON.parse(window.sessionStorage.getItem('trip'))
  document.getElementById('tripNameFormInput').value = newTrip.title
}

let addDestination = function (latLng, place, placeID) {
  let name = ''
  let order = newTrip.destinationList.length + 1
  let id = (new Date()).getTime()

  let newDestination = new Destination(latLng, place, placeID, name, order, id)
  newTrip.destinationList.push(newDestination)
  saveToSessionStorage()
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
  let placeID = place.place_id
  let label = String(newTrip.destinationList.length + 1)

  addMarker(place.geometry.location, placeName, label)
  addDestination(latLng, placeName, placeID)
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
  let placeID = ''
  service = new google.maps.places.PlacesService(map)
  service.nearbySearch(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // ToDo some checks for valid info here, sort and process for sensible name
      destinationName = results[0].name
      placeID = results[0].place_id
    }

    let placeName = destinationName
    let label = String(markersOnMap.length + 1)

    addMarker(latLng, placeName, label)
    addDestination(latLng, placeName, placeID)
    drawDestination(newTrip.destinationList[newTrip.destinationList.length - 1])
    map.panTo(latLng)
  })
}

// ------------------------
// Main Map Callback
// ------------------------
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
// --- End of Main Map Callback ---

// ------------------------
// JQuery Event Listeners
// ------------------------

// Make the Destination list draggable
$(document).ready(function () {
  $('#destinationTable').sortable({
    scroll: true,
    update: function (event, ui) {
      $('.destinationsTableRow .indexClass').each(function (i) {
        let numbering = i + 1
        $(this).text(numbering)
        for (let j = 0; j < newTrip.destinationList.length; j++) {
          if (newTrip.destinationList[j].id === Number($(this)[0].parentNode.id)) {
            newTrip.destinationList[j].order = numbering
          }
        }
      })
      // Sort by order to keep things sane
      newTrip.destinationList.sort((a, b) => (a.order > b.order) ? 1 : -1)
      clearMarkers()
      renderMarkers()
      saveToSessionStorage()
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
  saveToSessionStorage()
  if (newTrip.destinationList.length < 1) {
    $('#deleteDestinations').hide()
  }
})

// Click on a destination label in the trip itinerary
$(document).on('click', '.destinationLabelClass', function (e) {
  let id = $(this).parents('tr')[0].id
  let dest = newTrip.destinationList.find(function (obj) { return obj.id === Number(id) })
  map.panTo(dest.latLng)
  map.setZoom(16)
})

// Trash all destinations
$(document).on('click', '#deleteDestinations', function () {
  clearMarkers()
  $('#destinationTable').empty()
  newTrip.destinationList = []
  saveToSessionStorage()
  $('#deleteDestinations').hide()
})

// Save trip to DB with Save Trip button
$(document).on('click', '#saveTrip', function () {
  $.ajax({
    url: '/trip/data',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(newTrip),
    success: function (res) {
      console.log(res)
    }
  })
})

// Save Trip Button alert popup
$(document).ready(function () {
  $('#success-alert').hide()
  $('#saveTrip').click(function showAlert () {
    $('#success-alert').fadeTo(2000, 500).slideUp(500, function () {
      $('#success-alert').slideUp(500)
    })
  })
})

// Save Trip name upon input change
$(document).on('input paste', '#tripNameFormInput', function () {
  let name = document.getElementById('tripNameFormInput').value
  newTrip.title = name
  saveToSessionStorage()
})

// Save Destination name upon input change
$(document).on('change paste', '.destinationInputClass', function () {
  let id = $(this).parents('tr')[0].id
  console.log(id)
  console.log(this.value)
  for (let j = 0; j < newTrip.destinationList.length; j++) {
    if (newTrip.destinationList[j].id === Number(id)) {
      newTrip.destinationList[j].name = this.value
    }
  }
  saveToSessionStorage()
})

// upon page reload, this function is called
function renderOnReload () {
  $('#deleteDestinations').hide()
  if (window.sessionStorage.getItem('trip') !== null) {
    getFromSessionStorage()
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
  } else {
    startLocation = randomLocation
  }
}
