'use strict'

function signInInit () {
  gapi.load('auth2', function () {
    // initialise type 'gapi.auth2.GoogleAuth' object
    let auth2 = gapi.auth2.init({
      client_id: '770023573168-8lo6smmhtuifqt6enlcnsulssucf2eb0.apps.googleusercontent.com'
    })

    let onInit = function () {
      console.log('GoogleAuth object initialised.')
      // click handler
      let onLoginSuccess = function (googleUser) {
        $.ajax({
          url: '/google-auth',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            idToken: googleUser.getAuthResponse().id_token,
            signin: true
          }),
          success: function (response) {
            // console.log('response', response)
            let name = JSON.stringify(response.firstName + ' ' + response.lastName)
            window.sessionStorage.setItem('Name', name)
            window.sessionStorage.setItem('ImageURI', JSON.stringify(response.image))
            window.sessionStorage.setItem('Email', JSON.stringify(response.emailAddress))
            window.sessionStorage.setItem('Hash', JSON.stringify(response.hash))
            // direct to different pages based on whether the user is new or current
            if (response.userType === 'currentUser') {
              window.location = '/trip'
            } else if (response.userType === 'newUser') {
              window.alert('You have not registered with Away We Go.\nPlease register before signing in.')
            }
          }
        })
      }

      let onLoginFail = function (error) {
        console.log('Failed to sign in.', error)
      }

      // find google log in button
      let element = document.getElementById('googleLoginButton')
      // attach login to button
      auth2.attachClickHandler(element, {}, onLoginSuccess, onLoginFail)
    }

    let onError = function () {
      console.log('GoogleAuth object failed to initialise.')
    }

    if (window.location.pathname === '/sign-in') {
      auth2.then(onInit, onError)
    }
  })
}

$(document).ready(() => {
  $('#signInPageSignInButton').click(() => {
    var isAnyFieldEmpty = false
    $('input[class="form-control"]').each(function () {
      if ($(this).val() === '') {
        isAnyFieldEmpty = true
      }
    })
    if (isAnyFieldEmpty) {
      return false
    }

    let userInfo = {
      emailAddress: $('#inputEmail').val(),
      password: $('#inputPassword').val(),
      signin: true
    }
    // console.log('sign in info', userInfo)

    $.ajax({
      url: '/auth',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(userInfo),
      success: function (response) {
        // direct to different pages based on whether the user is new or current
        if (response.userType === 'currentUser') {
          // console.log('reg response', response)
          let name = JSON.stringify(response.firstName + ' ' + response.lastName)
          window.sessionStorage.setItem('Name', name)
          window.sessionStorage.setItem('ImageURI', JSON.stringify(response.image))
          window.sessionStorage.setItem('Email', JSON.stringify(response.emailAddress))
          window.sessionStorage.setItem('Hash', JSON.stringify(response.hash))
          window.location = '/trip'
        } else if (response.userType === 'incorrectUser') {
          window.alert('Your password is incorrect.')
        } else if (response.userType === 'newUser') {
          window.alert('No account with this email address exists.\nPlease register.')
        }
      }
    })
  })
})
