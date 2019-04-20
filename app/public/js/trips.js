let button = document.getElementById('addButton')

// button.addEventListener('click', function () {
//   let paragraph = document.createElement('p')
//   let text = document.createTextNode('This is a trip')
//   paragraph.appendChild(text)
//   let trips = document.getElementById('tripsList')
//   trips.appendChild(paragraph)
// }, false)

button.addEventListener('click', function () {
  let input = document.createElement('input')
  input.type = 'text'
  input.name = 'tripTitle[]'
  let tripsList = document.getElementById('tripsList')
  tripsList.appendChild(input)
}, false)
