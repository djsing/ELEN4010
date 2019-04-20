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

  $('#mapsButton').click(function (event) {
    window.location = '/map'
  })

  $('#hotelsButton').click(function (event) {
    window.location = '/hotels'
  })
})
