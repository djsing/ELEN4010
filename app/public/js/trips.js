
let addTripTitle = function () {
  let input = document.createElement('input')
  input.type = 'text'
  input.name = 'tripTitle[]'
  let tripsList = document.getElementById('tripsList')
  tripsList.appendChild(input)
  document.getElementById('saveButton').hidden = false
  document.getElementById('addButton').disabled = true
}
