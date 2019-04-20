'use strict'

function updateProfile () {
  let heading = document.getElementById('profileHeading')
  heading.innerText = heading.innerText + ' ' + JSON.parse(window.localStorage.getItem('Name'))
}

$(document).ready(function () {
  if (window.location.pathname === '/profile') {
    updateProfile()
  }
})
