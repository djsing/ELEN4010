'use strict'

let countries = {
  'au': {
    center: { lat: -25.3, lng: 133.8 },
    zoom: 4
  },
  'br': {
    center: { lat: -14.2, lng: -51.9 },
    zoom: 4
  },
  'ca': {
    center: { lat: 62, lng: -110.0 },
    zoom: 4
  },
  'fr': {
    center: { lat: 46.2, lng: 2.2 },
    zoom: 5
  },
  'de': {
    center: { lat: 51.2, lng: 10.4 },
    zoom: 5
  },
  'gr': {
    center: { lat: 37.59, lng: 23.43 },
    zoom: 4
  },
  'mx': {
    center: { lat: 23.6, lng: -102.5 },
    zoom: 4
  },
  'nz': {
    center: { lat: -40.9, lng: 174.9 },
    zoom: 5
  },
  'it': {
    center: { lat: 41.9, lng: 12.6 },
    zoom: 5
  },
  'za': {
    center: { lat: -30.6, lng: 22.9 },
    zoom: 5
  },
  'es': {
    center: { lat: 40.5, lng: -3.7 },
    zoom: 5
  },
  'pt': {
    center: { lat: 39.4, lng: -8.2 },
    zoom: 6
  },
  'us': {
    center: { lat: 37.1, lng: -95.7 },
    zoom: 4
  },
  'uk': {
    center: { lat: 54.8, lng: -4.6 },
    zoom: 5
  }
}

let darkMapType =
[
  {
    'featureType': 'all',
    'elementType': 'all',
    'stylers': [
      {
        'visibility': 'on'
      }
    ]
  },
  {
    'featureType': 'all',
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'off'
      },
      {
        'saturation': '-100'
      }
    ]
  },
  {
    'featureType': 'all',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'saturation': 36
      },
      {
        'color': '#000000'
      },
      {
        'lightness': 40
      },
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'all',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'visibility': 'off'
      },
      {
        'color': '#000000'
      },
      {
        'lightness': 16
      }
    ]
  },
  {
    'featureType': 'all',
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'administrative',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#000000'
      },
      {
        'lightness': 20
      }
    ]
  },
  {
    'featureType': 'administrative',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#000000'
      },
      {
        'lightness': 17
      },
      {
        'weight': 1.2
      }
    ]
  },
  {
    'featureType': 'landscape',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#000000'
      },
      {
        'lightness': 20
      }
    ]
  },
  {
    'featureType': 'landscape',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#4d6059'
      }
    ]
  },
  {
    'featureType': 'landscape',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#4d6059'
      }
    ]
  },
  {
    'featureType': 'landscape.natural',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#4d6059'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'geometry',
    'stylers': [
      {
        'lightness': 21
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#4d6059'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#4d6059'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': [
      {
        'visibility': 'on'
      },
      {
        'color': '#7f8d89'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#7f8d89'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#7f8d89'
      },
      {
        'lightness': 17
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#7f8d89'
      },
      {
        'lightness': 29
      },
      {
        'weight': 0.2
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#000000'
      },
      {
        'lightness': 18
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#7f8d89'
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#7f8d89'
      }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#000000'
      },
      {
        'lightness': 16
      }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#7f8d89'
      }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#7f8d89'
      }
    ]
  },
  {
    'featureType': 'transit',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#000000'
      },
      {
        'lightness': 19
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'all',
    'stylers': [
      {
        'color': '#2b3638'
      },
      {
        'visibility': 'on'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#2b3638'
      },
      {
        'lightness': 17
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#24282b'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#24282b'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  }
]

let silverMapType =
[
  {
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#f5f5f5'
      }
    ]
  },
  {
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#616161'
      }
    ]
  },
  {
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#f5f5f5'
      }
    ]
  },
  {
    'featureType': 'administrative.country',
    'stylers': [
      {
        'weight': 8
      }
    ]
  },
  {
    'featureType': 'administrative.land_parcel',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#bdbdbd'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#eeeeee'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#757575'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#e5e5e5'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9e9e9e'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#ffffff'
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#757575'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#dadada'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#616161'
      }
    ]
  },
  {
    'featureType': 'road.local',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9e9e9e'
      }
    ]
  },
  {
    'featureType': 'transit.line',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#e5e5e5'
      }
    ]
  },
  {
    'featureType': 'transit.station',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#eeeeee'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#c9c9c9'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9e9e9e'
      }
    ]
  }
]

function updateProfile () {
  let usernameTag = document.getElementById('usernameTag')
  usernameTag.textContent = JSON.parse(window.sessionStorage.getItem('Name') + ' ')
  let emailTag = document.getElementById('emailTag')
  emailTag.textContent = JSON.parse(window.sessionStorage.getItem('Email') + ' ')
}

function clearTripSessionStorage () {
  window.sessionStorage.removeItem('trip')
}

function randomBetween (min, max) {
  if (min < 0) {
    return min + Math.random() * (Math.abs(min) + max)
  } else {
    return min + Math.random() * max
  }
}

let randomProperty = function (obj) {
  let keys = Object.keys(obj)
  return obj[ keys[ keys.length * Math.random() << 0 ] ]
}

function randomLocation () {
  return randomProperty(countries)
}

$(document).ready(function () {
  updateProfile()
})
