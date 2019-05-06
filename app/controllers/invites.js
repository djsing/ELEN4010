$(document).on('click', '#inviteEditorButton', function () {
  createInvitePopup()
  // Show the model popup
  $('.modal').show('slow')
})

$(document).on('click', '.close', function () {
  let modalBox = $('div.modal')
  modalBox.hide()
})

$(document).on('click', '#inviteEmailAddressButton', function () {
  let emailAddressField = $('#emailAddressField')
  let emailAddress = emailAddressField.val()

  // Validate the email address
  // If it's valid, proceed to post it, if not, clear the field and warn the user
  if (!isValidEmail(emailAddress)) {
    // Clear the input field
    emailAddressField.val('')
    // Tell the user that an invalid email address has been entered
    $('#invalidEmailMessage').hide()
    $('#invalidEmailMessage').show('slow')
  } else {
    // Send the email address to the back-end server
    console.log('The id for this trip is: ' + newTrip.id.toString())
    let inviteInfo = {
      'tripID': newTrip.id.toString(),
      'emailAddress': emailAddress.toString()
    }
    $.ajax({
      url: '/invite',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(inviteInfo),
      success: function (res) {
        // Display to user that an invite has been sent to the desired email address
        displayInviteSentMessage(emailAddress)
      }
    })
  }
})

let displayInviteSentMessage = function (emailAddress) {
  // Empty the modal box
  let modalBox = $('div.modal')
  modalBox.empty()

  // Add the exit button
  let exitButtonArea = $('<span class="close">&times;</span>')
  modalBox.append(exitButtonArea)

  // Create invite sent header
  let headerMessage = $('<h1 class="modal-element" id="inviteSendHeader">')
  headerMessage.text('Group invite sent to:')
  modalBox.append(headerMessage)

  // Display email address
  let emailAddressText = $('<p class="modal-element" id="emailAddress"> ' + emailAddress + ' </p>')
  modalBox.append(emailAddressText)
}

let createInvitePopup = function () {
  // Clear the existing modal area
  $('#modalArea').empty()

  // Create modal div
  let modalDiv = $('<div class="modal"></div>')
  $('#modalArea').append(modalDiv)

  // Add the exit button
  let exitButtonArea = $('<span class="close">&times;</span>')
  modalDiv.append(exitButtonArea)

  // Add header
  let header = $('<h1> Invite A Group Member </h1>')
  modalDiv.append(header)

  // Add prompt text
  let promptText = $('<p class="modal-element">Please type in the email address of a desired group member</p>')
  modalDiv.append(promptText)

  // Add email field
  let emailField = $('<input class="modal-element" type="text" id="emailAddressField">')
  modalDiv.append(emailField)

  // Add invite button
  let inviteButton = $('<input class="modal-element" type="button" value="Invite" id="inviteEmailAddressButton">')
  modalDiv.append(inviteButton)

  // Add invalid email message
  let invalidEmailMessage = $('<p class="modal-element" id="invalidEmailMessage">The email address you have entered is invalid </p>')
  modalDiv.append(invalidEmailMessage)
}

let isValidEmail = function (emailAddress) {
  // See if the email conforms to regex for emails
  let regexForEmails = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm

  if (emailAddress === '' || !regexForEmails.test(emailAddress)) {
    return false
  }
  return true
}
