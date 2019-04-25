'user strict'

document.addEventListener('DOMContentLoaded', function () {
  let lang
  if (document.querySelectorAll('#map').length > 0) {
    if (document.querySelector('html').lang) {
      lang = document.querySelector('html').lang
    } else {
      lang = 'en'
    }

    let jsFile = document.createElement('script')
    jsFile.type = 'text/javascript'
    jsFile.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCgnuMPrM3Yha6Y9K6f_XkdifRrE2t33Z4&libraries=places&callback=initMap&language=' + lang
    document.getElementsByTagName('head')[0].appendChild(jsFile)
  }
})

let map, infoWindow, service
let worldView = { lat: 10, lng: 350 }
let markerInfo = []
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
  addMarkerInfo()
}

let deleteMarker = function (id) {
  // remove the marker from the map (a null-map marker)
  try {
    markersOnMap[id].setMap(null)
  } catch (error) {}
  // check if the last entr(ies) of the array is a null-map marker
  let size = markersOnMap.length - 1
  try {
    while (markersOnMap[size].map === null) {
      markersOnMap.pop()
      size = markersOnMap.length - 1
    }
  } catch (error) {}
  // Check that the whole array is not full of null-map markers:
  if (markersOnMap.length !== 0) {
    let j = 0
    for (let i = 0; i < markersOnMap.length; i++) {
      if (markersOnMap[i].map === null) {
        j++
      }
    }
    if (j === markersOnMap.length) {
      markersOnMap = []
      markerInfo = []
      markersOnMap.length = 0
      markerInfo.length = 0
    }
  }
}

function addMarkerInfo () {
  for (let i = 0; i < markersOnMap.length; i++) {
    let contentString = '<div id="content"><h1>' + markersOnMap[i].contentString
    let marker = markersOnMap[i]

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 200
    })

    marker.addListener('click', function () {
      closeOtherInfo()
      infowindow.open(marker.get('map'), marker)
      markerInfo[0] = infowindow
    })

    google.maps.event.addListener(marker, 'rightclick', function (e) {
      let clicked = this
      deleteMarker(clicked.id)
    })
  }
}

function closeOtherInfo () {
  if (markerInfo.length > 0) {
    /* detach the info-window from the marker */
    markerInfo[0].set('marker', null)
    /* close it */
    markerInfo[0].close()
    /* blank the array */
    markerInfo.length = 0
  }
}

function placeDestination (place, marker, infoWindow, infoWindowContent) {
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

  infoWindowContent.children['place-icon'].src = place.icon
  infoWindowContent.children['place-name'].textContent = place.name
  infoWindowContent.children['place-address'].textContent = address
  infoWindow.open(map, marker)

  let id = markersOnMap.length
  let label = String(id + 1)
  let placeName = 'Destination ' + label + ': ' + place.name
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
      destinationName = ': ' + results[0].name
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
    center: worldView,
    zoom: 3,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false
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

  infoWindow = new google.maps.InfoWindow()
  let infoWindowContent = document.getElementById('infowindow-content')
  infoWindow.setContent(infoWindowContent)

  let marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, 0)
  })

  map.addListener('click', function (e) {
    infoWindow.close()
    marker = new google.maps.Marker({
      position: e.latLng,
      map: map
    })
    marker.setVisible(false)
    placeMarkerAndPanTo(e.latLng, map)
  })

  autocomplete.addListener('place_changed', function () {
    infoWindow.close()
    marker.setVisible(true)
    let place = autocomplete.getPlace()
    placeDestination(place, marker, infoWindow, infoWindowContent)
  })
}
