'use strict'

$(document).ready(function () {
  $('#landingPageSignInButton').click(function () {
    window.location = '/sign-in'
  })

  $('#landingPageRegisterButton').click(function () {
    window.location = '/register'
  })

  $('#aboutButton').click(function () {
    window.location = '/about'
  })
})
