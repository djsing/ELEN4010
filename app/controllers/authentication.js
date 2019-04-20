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
        console.log('ID: ' + profile.getId()) // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName())
        console.log('Image URL: ' + profile.getImageUrl())
        console.log('Email: ' + profile.getEmail()) // This is null if the 'email' scope is not present.
        // The ID token to pass to backend:
        var idToken = googleUser.getAuthResponse().id_token
        console.log('ID Token: ' + idToken)
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
