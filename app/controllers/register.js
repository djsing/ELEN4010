'use strict'

function signInInit () {
  gapi.load('auth2', () => {
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
            signin: false
          }),
          success: function (response) {
            // console.log('response', response)
            let name = JSON.stringify(response.firstName + ' ' + response.lastName)
            window.sessionStorage.setItem('Name', name)
            window.sessionStorage.setItem('ImageURI', JSON.stringify(response.image))
            window.sessionStorage.setItem('Email', JSON.stringify(response.emailAddress))
            // direct to different pages based on whether the user is new or current
            if (response.userType === 'currentUser') {
              window.location = '/trip'
            } else if (response.userType === 'newUser') {
              window.location = '/trip'
            } else {
              console.error('bad google response', response)
            }
          }
        })
      }

      let onLoginFail = function (error) {
        console.log('Failed to sign in.', error)
      }

      // find google log in button
      let element = document.getElementById('googleRegisterButton')
      // attach login to button
      auth2.attachClickHandler(element, {}, onLoginSuccess, onLoginFail)
    }

    let onError = function () {
      console.log('GoogleAuth object failed to initialise.')
    }

    auth2.then(onInit, onError)
  })
}

function signOut () {
  let authInstance = gapi.auth2.getAuthInstance()
  authInstance.signOut().then(function () {
    console.log('User signed out.')
  })
}

$(document).ready(() => {
  $('#registerSignInButton').click(() => {
    window.location = '/sign-in'
  })

  $('#TCLink').click(() => { window.open('/terms_and_conditions') })

  $('#registerButton').click(() => {
    if ($('#registerInputPassword').val() !== $('#registerInputConfirmPassword').val()) {
      return false
    }
    var isAnyFieldEmpty = false
    $('input[class="form-control"]').each(function () {
      if ($(this).val() === '') {
        isAnyFieldEmpty = true
      }
    })
    if (isAnyFieldEmpty) {
      return false
    }
    if (!$('#TCCheck').prop('checked')) {
      window.alert('Please Accept the Terms and Conditions.')
      return false
    }

    let userInfo = {
      firstName: $('#registerInputName').val(),
      lastName: $('#registerInputSurname').val(),
      emailAddress: $('#registerInputEmail').val(),
      password: $('#registerInputPassword').val()
    }
    // console.log('user info', userInfo)

    $.ajax({
      url: '/auth',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(userInfo),
      success: function (response) {
        // console.log('reg response', response)
        let name = JSON.stringify(response.firstName + ' ' + response.lastName)
        window.sessionStorage.setItem('Name', name)
        window.sessionStorage.setItem('ImageURI', JSON.stringify(response.image))
        window.sessionStorage.setItem('Email', JSON.stringify(response.emailAddress))
        // direct to different pages based on whether the user is new or current
        if (response.userType === 'currentUser') {
          window.location = '/trip'
        } else if (response.userType === 'newUser') {
          window.location = '/trip'
        } else {
          console.error('bad response', response)
        }
      }
    })
  })
})
