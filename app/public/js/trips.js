let button = document.getElementById('addButton')

button.addEventListener('click', function () {
  let paragraph = document.createElement('p')
  let text = document.createTextNode('This is a trip')
  paragraph.appendChild(text)
  document.body.appendChild(paragraph)
}, false)
