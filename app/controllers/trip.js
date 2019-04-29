'use strict'

let map, service
let markersOnMap = []

function addMarker (latLng, map, id, label, placeName) {
  let marker = new google.maps.Marker({
    position: latLng,
    map: map,
    label: label,
    id: id,
    contentString: placeName
  })
  markersOnMap.push(marker)
  addDestination('', placeName)
}

function placeDestination (place, marker) {
  if (!place.geometry) {
    // User entered the name of a Place that was not suggested and
    // pressed the Enter key, or the Place Details request failed.
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

  let address = ''
  if (place.address_components) {
    address = [
      ((place.address_components[0] && place.address_components[0].short_name) || ''),
      ((place.address_components[1] && place.address_components[1].short_name) || ''),
      ((place.address_components[2] && place.address_components[2].short_name) || '')
    ].join(' ')
  }

  let id = markersOnMap.length
  let label = String(id + 1)
  let placeName = place.name
  addMarker(place.geometry.location, map, id, label, placeName)
}

function placeMarkerAndPanTo (latLng, map) {
  let request = {
    bounds: map.bounds,
    location: latLng,
    rankBy: google.maps.places.RankBy.DISTANCE,
    type: ['sublocality'],
    fields: ['name', 'formatted_address', 'place_id', 'geometry']
  }

  let destinationName = ''
  service = new google.maps.places.PlacesService(map)
  service.nearbySearch(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // ToDo some checks for valid info here, sort and process for sensible name
      destinationName = results[0].name
    }

    let id = markersOnMap.length
    let label = String(id + 1)
    let placeName = 'Destination ' + label + destinationName
    addMarker(latLng, map, id, label, placeName)
    map.panTo(latLng)
  })
}
function initMap () {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 10, lng: 350 },
    zoom: 3,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false,
    fullscreenControl: false
  })

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
    placeMarkerAndPanTo(e.latLng, map)
  })

  autocomplete.addListener('place_changed', function () {
    marker.setVisible(true)
    let place = autocomplete.getPlace()
    placeDestination(place, marker)
  })
}

let saveTripTitle = function () {}

let addIndexRow = function () {
  let indexTable = document.getElementById('indexTableBody')
  let index = indexTable.rows.length
  let indexRow = document.createElement('tr')
  let indexCell = document.createElement('td')
  let destinationIndex = document.createTextNode(index + 1)
  indexCell.appendChild(destinationIndex)
  indexRow.appendChild(indexCell)
  indexTable.appendChild(indexRow)
}

let addDestinationRow = function (destinationInput, destinationPlace) {
  let destinationsTable = document.getElementById('destinationsTableBody')
  let row = document.createElement('tr')
  let destinationCell = document.createElement('td')
  let destInput = document.createElement('input')
  destInput.className = 'destInput'
  destInput.placeholder = 'New Destination'
  destInput.value = destinationInput
  destinationCell.appendChild(destInput)
  destinationPlace = document.createTextNode(destinationPlace)
  destinationCell.appendChild(destinationPlace)
  row.appendChild(destinationCell)
  let deleteButtonCell = document.createElement('td')
  let deleteButton = document.createElement('input')
  deleteButton.type = 'button'
  deleteButton.value = 'x'
  deleteButton.className = 'deleteButton'
  deleteButtonCell.appendChild(deleteButton)
  row.appendChild(deleteButtonCell)
  destinationsTable.appendChild(row)
}

let addDestination = function (destinationInput, destinationPlace) {
  addIndexRow()
  addDestinationRow(destinationInput, destinationPlace)
}

// upon page reload, this function is called
let renderItinerary = function () {
  $('#indexTableBody').empty()
  $('#destinationsTableBody').empty()
  $.ajax({
    url: '/tripSidebar/data',
    method: 'GET',
    contentType: 'application/json',
    success: (res) => {
      for (let i = 0; i < res.destInputs.length; i++) {
        addDestination(res.destInputs[i], res.destNames[i])
      }
    }
  })
}

let saveItinerary = function () {
  let destInputs = []
  let destNames = []
  let destTable = document.getElementById('destinationsTable')
  for (let i = 0, rows; rows = destTable.rows[i]; i++) {
    let inputField = rows.cells[0].childNodes[0]
    let text = rows.cells[0].textContent
    destInputs.push(inputField.value)
    destNames.push(text)
  }
  let itinerary = {
    'destInputs': destInputs,
    'destNames': destNames
  }

  $.ajax({
    url: '/tripSidebar/data',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(itinerary),
    success: function (res) {
    }
  })
}

$('#destinationsTable').on('click', '.deleteButton', function () {
  let oldRow = $(this).closest('tr')
  let destInput = oldRow.find('input.destInput')
  let destInputValue = destInput.val()
  let destName = oldRow.find('td:eq(0)').html()
  oldRow.index()
  let indexTable = $('#indexTableBody')
  let removeRow = indexTable.find('tr:eq(' + oldRow.index() + ')')
  removeRow.remove()

  let destination = {
    'destInput': destInputValue,
    'destName': destName
  }
  $.ajax({
    url: '/tripSidebar/data',
    method: 'DELETE',
    contentType: 'application/json',
    data: JSON.stringify(destination),
    success: function (res) {
      renderItinerary()
    }
  })

  oldRow.remove()
})
