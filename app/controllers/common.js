function updateProfile () {
  let usernameTag = document.getElementById('usernameTag')
  usernameTag.textContent = JSON.parse(window.sessionStorage.getItem('Name') + ' ')
  let emailTag = document.getElementById('emailTag')
  emailTag.textContent = JSON.parse(window.sessionStorage.getItem('Email') + ' ')
}

function clearTripFromSessionStorage () {
  window.sessionStorage.removeItem('trip')
}

// Get User name for menu
$(document).ready(function () {
  updateProfile()
})
