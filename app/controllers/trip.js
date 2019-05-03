'use strict'

let map, service
let markersOnMap = []

class Destination {
  constructor (latLng, id, place, order) {
    this.latLng = latLng
    this.id = id
    this.place = place
    this.name = ''
    this.order = order
  }
}

var generateid = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9)
}

class Trip {
  constructor () {
    let title = ''
    let destinationList = []
    let id = ''
  }
}

let newTrip = new Trip()

function saveToLocal () {
  getTripTitle()
  localStorage.setItem('trip', JSON.stringify(newTrip))
}

function getFromLocal () {
  newTrip = JSON.parse(localStorage.getItem('trip'))
  setTripTitle()
}

function addMarker (latLng, id, placeName, label) {
  let marker = new google.maps.Marker({
    position: latLng,
    map: map,
    label: label
  })
  markersOnMap.push(marker)
  addDestination(latLng, id, placeName)
  drawDestination(newTrip.destinationList[newTrip.destinationList.length - 1])
}

function placeDestinationBySearch (place, marker) {
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

  let id = (new Date()).getTime()
  let placeName = place.name
  let label = String(newTrip.destinationList.length + 1)
  addMarker(place.geometry.location, id, placeName, label)
}

function placeDestinationByClick (latLng) {
  let request = {
    bounds: map.bounds,
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

    let id = (new Date()).getTime()
    let placeName = destinationName
    let label = String(markersOnMap.length + 1)
    addMarker(latLng, id, placeName, label)
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
    fullscreenControl: false,
    draggableCursor: 'default'
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
    placeDestinationByClick(e.latLng, map)
  })

  autocomplete.addListener('place_changed', function () {
    marker.setVisible(true)
    let place = autocomplete.getPlace()
    placeDestinationBySearch(place, marker)
  })
}

let addDestination = function (latLng, id, placeName) {
  let order = newTrip.destinationList.length + 1
  let newDestination = new Destination(latLng, id, placeName, order)
  newTrip.destinationList.push(newDestination)
  saveToLocal()
}

let drawDestination = function (dest) {
  let row = document.createElement('tr')
  row.id = dest.id
  row.className = 'destinationsTableRow'

  let destNum = document.createElement('td')
  destNum.innerHTML = String(dest.order)
  destNum.classList.add('indexClass')
  destNum.setAttribute('style', 'width: 10%')
  row.appendChild(destNum)

  let destPlace = document.createElement('td')
  destPlace.innerHTML = dest.place
  row.appendChild(destPlace)

  let deleteButtonCell = document.createElement('td')
  let deleteButton = document.createElement('i')
  deleteButton.type = 'button'
  deleteButton.value = ''
  deleteButton.id = 'deleteButton'
  deleteButton.className = 'fas'
  deleteButton.classList.add('fa-trash-alt')
  deleteButtonCell.appendChild(deleteButton)

  row.appendChild(deleteButtonCell)
  document.getElementById('destinationTable').appendChild(row)
}

let clearMarkers = function () {
  for (let i = 0; i < markersOnMap.length; i++) {
    markersOnMap[i].setMap(null)
  }
  markersOnMap = []
}

let renderMarkers = function () {
  for (let j = 0; j < newTrip.destinationList.length; j++) {
    let marker = new google.maps.Marker({
      position: newTrip.destinationList[j].latLng,
      map: map,
      label: String(newTrip.destinationList[j].order)
    })
    markersOnMap.push(marker)
  }
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
})

$(document).on('click', '#deleteDestinations', function () {
  clearMarkers()
  $('#destinationTable').empty()
  newTrip.destinationList = []
  saveToLocal()
})

// upon page reload, this function is called
function renderOnReload () {
  if (localStorage.getItem('trip') !== null) {
    getFromLocal()
    for (let i = 0; i < newTrip.destinationList.length; i++) {
      drawDestination(newTrip.destinationList[i])
    }
    renderMarkers()
  }
}

let getTripTitle = function () {
  let title = document.getElementById('formGroupExampleInput')
  newTrip.title = title.value
}

let setTripTitle = function () {
  document.getElementById('formGroupExampleInput').value = newTrip.title
}

$(document).on('click', '#saveTrip', function () {
  $.ajax({
    url: '/trip/data',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(newTrip),
    success: function (res) {
    }
  })
})

$(document).change('#formGroupExampleInput', function () {
  saveToLocal()
})

let clearLocalStorage = function () {
  localStorage.clear()
}

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

// let saveItinerary = function () {
//   let destInputs = []
//   let destNames = []
//   let destTable = document.getElementById('destinationsTable')
//   for (let i = 0, rows; rows = destTable.rows[i]; i++) {
//     let inputField = rows.cells[0].childNodes[0]
//     let text = rows.cells[0].textContent
//     destInputs.push(inputField.value)
//     destNames.push(text)
//   }
//   let itinerary = {
//     'destInputs': destInputs,
//     'destNames': destNames
//   }

//   $.ajax({
//     url: '/trip/data',
//     method: 'POST',
//     contentType: 'application/json',
//     data: JSON.stringify(itinerary),
//     success: function (res) {
//     }
//   })
// }

// $('#destinationsTable').on('click', '.deleteButton', function () {
//   let oldRow = $(this).closest('tr')
//   let destInput = oldRow.find('input.destInput')
//   let destInputValue = destInput.val()
//   let destName = oldRow.find('td:eq(0)').html()
//   oldRow.index()
//   let indexTable = $('#indexTableBody')
//   let removeRow = indexTable.find('tr:eq(' + oldRow.index() + ')')
//   removeRow.remove()

//   let destination = {
//     'destInput': destInputValue,
//     'destName': destName
//   }
//   $.ajax({
//     url: '/trip/data',
//     method: 'DELETE',
//     contentType: 'application/json',
//     data: JSON.stringify(destination),
//     success: function (res) {
//       renderItinerary()
//     }
//   })

//   oldRow.remove()
// })
