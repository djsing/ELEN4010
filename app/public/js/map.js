document.addEventListener('DOMContentLoaded', function () {
  let lang
  if (document.querySelectorAll('#map').length > 0) {
    if (document.querySelector('html').lang) {
      lang = document.querySelector('html').lang
    } else {
      lang = 'en'
    }

    var jsFile = document.createElement('script')
    jsFile.type = 'text/javascript'
    jsFile.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCgnuMPrM3Yha6Y9K6f_XkdifRrE2t33Z4&libraries=places&callback=initMap&language=' + lang
    document.getElementsByTagName('head')[0].appendChild(jsFile)
  }
})

var map, infoWindow, service
var worldView = { lat: 10, lng: 350 }
var markerInfo = []
var markersOnMap = []

function addMarkerInfo () {
  for (var i = 0; i < markersOnMap.length; i++) {
    var contentString = '<div id="content"><h1>' + markersOnMap[i].placeName

    const marker = new google.maps.Marker({
      position: markersOnMap[i].LatLng[0],
      map: map
    })

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 200
    })

    marker.addListener('click', function () {
      closeOtherInfo()
      infowindow.open(marker.get('map'), marker)
      markerInfo[0] = infowindow
    })
    // marker.addListener('mouseover', function () {
    //   closeOtherInfo()
    //   infowindow.open(marker.get('map'), marker)
    //   markerInfo[0] = infowindow
    // })
    // marker.addListener('mouseout', function () {
    //   closeOtherInfo()
    //   infowindow.close()
    //   markerInfo[0] = infowindow
    // })
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

function placeMarkerAndPanTo (latLng, map) {
  // var marker = new google.maps.Marker({
  //   position: latLng,
  //   map: map
  // })
  var newMarker = {
    placeName: 'Destination' + Number(markersOnMap.length + 1),
    LatLng: [latLng]
  }
  markersOnMap.push(newMarker)
  map.panTo(latLng)
  addMarkerInfo()
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

  var card = document.getElementById('pac-card')
  var input = document.getElementById('pac-input')

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card)

  var autocomplete = new google.maps.places.Autocomplete(input)

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map)

  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(
    ['address_components', 'geometry', 'icon', 'name'])

  infoWindow = new google.maps.InfoWindow()
  var infoWindowContent = document.getElementById('infowindow-content')
  infoWindow.setContent(infoWindowContent)

  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, 0)
  })

  map.addListener('click', function (e) {
    placeMarkerAndPanTo(e.latLng, map)
  })

  autocomplete.addListener('place_changed', function () {
    infoWindow.close()
    marker.setVisible(true)
    var place = autocomplete.getPlace()
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
    marker.setVisible(true)

    var address = ''
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
  })

  // var place = autocomplete.getPlace()

  // var request = {
  //   placeId: place.place_id,
  //   fields: ['name', 'formatted_address', 'place_id', 'geometry']
  // }

//   service = new google.maps.places.PlacesService(map)
//   service.getDetails(request, function (place, status) {
//     if (status === google.maps.places.PlacesServiceStatus.OK) {
//       var marker = new google.maps.Marker({
//         map: map,
//         position: place.geometry.location
//       })
//       google.maps.event.addListener(marker, 'click', function () {
//         infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' +
//           'Place ID: ' + place.place_id + '<br>' +
//           place.formatted_address + '</div>')
//         infoWindow.open(map, this)
//       })
//     }
//   })
}
