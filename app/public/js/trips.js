
let deleteButtons = document.getElementsByClassName('DeleteButtonClass')

let addTripTitle = function () {
  let input = document.createElement('input')
  input.type = 'text'
  input.name = 'tripTitleInput'
  let tripsList = document.getElementById('tripsList')
  tripsList.appendChild(input)
  document.getElementById('saveButton').hidden = false
  document.getElementById('addButton').disabled = true
}

// // variable for the user input trip title to be stored to

let saveTripTitle = function () {
  // save the input from the textbox to a variable
  // print the value from that variable back to the HTML file (inside the body)
  document.getElementById('saveButton').hidden = true
  document.getElementById('editButton').hidden = false
  document.getElementById('deleteButton').hidden = false
}

// let editTripTitle = function () {
//   // enable the trip title variable to be modified
//   document.getElementById('saveButton').hidden = false
//   document.getElementById('editButton').hidden = true
//   document.getElementById('deleteButton').hidden = true
// }

let deleteTripTitle = function (buttonElem) {
}

let removeRow = function (buttonElem) {
  let row = buttonElem.parentNode.parentNode
  row.parentNode.removeChild(row)
}

let editTitle = function (editButtonName, inputElemName) {
  document.getElementById(inputElemName).disabled = false
  // create save button
  let editButton = document.getElementById(editButtonName)
  editButton.parentNode.appendChild(createSaveButton())
  editButton.parentNode.removeChild(editButton)
}

let createSaveButton = function () {
  let saveButton = document.createElement('Input')
  saveButton.value = 'Save'
  saveButton.type = 'submit'
  return saveButton
}
