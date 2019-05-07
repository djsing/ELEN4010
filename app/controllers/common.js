let check = JSON.parse(window.sessionStorage.getItem('Hash'))
// console.log(check)
if ((check === null) || (check === undefined)) {
  window.location = '/sign-in'
} else {
  updateProfile()
}

function updateProfile () {
  let usernameTag = document.getElementById('usernameTag')
  usernameTag.textContent = JSON.parse(window.sessionStorage.getItem('Name') + ' ')
  let emailTag = document.getElementById('emailTag')
  emailTag.textContent = JSON.parse(window.sessionStorage.getItem('Email') + ' ')
}

function clearTripFromSessionStorage () {
  window.sessionStorage.removeItem('trip')
}

function signOut () {
  // normal sign-out
  document.cookie = 'awaywegosession=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
  document.cookie = 'awaywegosession.sig=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
  window.sessionStorage.clear()
  window.localStorage.clear()
}

// Get User name for menu
$(document).ready(function () {
  $('#signOutButton').click(() => {
    let authInstance = gapi.auth2.getAuthInstance()
    authInstance.signOut().then(function () {
      signOut()
      console.log('User signed out.')
      window.location = '/'
    })
  })
})
