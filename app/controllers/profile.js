'use strict'

function updateProfile () {
  let heading = document.getElementById('profileHeading')
  heading.innerText = heading.innerText + ' ' + JSON.parse(window.sessionStorage.getItem('Name'))
  let emailTag = document.getElementById('emailTag')
  emailTag.innerText = emailTag.innerText + ' ' + JSON.parse(window.sessionStorage.getItem('Email'))
}

$(document).ready(function () {
  if (window.location.pathname === '/profile') {
    updateProfile()
  }

  $('#mapsButton').click(function () {
    window.location = '/map'
  })

  $('#hotelsButton').click(function () {
    window.location = '/hotels'
  })

  $('#tripsButton').click(function () {
    window.location = '/trips'
  })
})
