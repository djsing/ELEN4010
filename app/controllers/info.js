'use strict'

function updateProfile () {
  let usernameTag = document.getElementById('usernameTag')
  usernameTag.textContent = JSON.parse(window.sessionStorage.getItem('Name'))
  let emailTag = document.getElementById('emailTag')
  emailTag.textContent = JSON.parse(window.sessionStorage.getItem('Email'))
}

$(document).ready(function () {
  updateProfile()
})
