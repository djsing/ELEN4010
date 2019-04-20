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
    jsFile.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCgnuMPrM3Yha6Y9K6f_XkdifRrE2t33Z4&libraries=places&callback=initMap&signed_in=true&language=' + lang
    document.getElementsByTagName('head')[0].appendChild(jsFile)
  }
})

var map, infoWindow

function initMap () {
  let worldView = { lat: 10, lng: 340 }
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
    anchorPoint: new google.maps.Point(0, -29)
  })

  map.addListener('click', function (e) {
    placeMarkerAndPanTo(e.latLng, map)
    addTripDestination()
  })

  autocomplete.addListener('place_changed', function () {
    infoWindow.close()
    marker.setVisible(false)
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
}

function placeMarkerAndPanTo (latLng, map) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  })
  map.panTo(latLng)
}
