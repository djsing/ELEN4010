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
        let profile = googleUser.getBasicProfile()
        window.sessionStorage.setItem('Name', JSON.stringify(profile.getName()))
        window.sessionStorage.setItem('ImageURI', JSON.stringify(profile.getImageUrl()))
        window.sessionStorage.setItem('Email', JSON.stringify(profile.getEmail()))
        $.ajax({
          url: '/auth',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ idToken: googleUser.getAuthResponse().id_token }),
          success: function (response) {
            console.log('response', response)
            if (response === 'authenticated') {
              window.location = '/profile'
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

    auth2.then(onInit, onError)
  })
}

function signOut () {
  let authInstance = gapi.auth2.getAuthInstance()
  authInstance.signOut().then(function () {
    console.log('User signed out.')
  })
}
