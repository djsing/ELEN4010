'use strict'

let markersOnMap = []

let drawDestination = function (dest) {
  let row = document.createElement('tr')
  row.id = dest.id
  row.className = 'destinationsTableRow'

  let destNum = document.createElement('td')
  destNum.innerHTML = String(dest.order)
  destNum.classList.add('indexClass')
  destNum.setAttribute('style', 'width: 10%')
  row.appendChild(destNum)

  let destPlaceCell = document.createElement('td')
  destPlaceCell.classList.add('destinationClass')
  destPlaceCell.setAttribute('style', 'width: 80%')

  let destInput = document.createElement('input')
  // destInput.className = 'form-control'
  destInput.className = 'destinationInputClass'
  destInput.setAttribute('style', 'font-size: 1rem; padding: 0.5rem 0rem;background-color: #fff0;')
  destInput.type = 'text'
  destInput.setAttribute('placeholder', 'Destination name...')
  if (dest.name !== '') {
    destInput.setAttribute('value', dest.name)
  }

  let destLabel = document.createElement('label')
  destLabel.classList.add('destinationLabelClass')
  destLabel.setAttribute('style', 'font-size: 0.75rem;color: #aaa;')

  destLabel.innerHTML = dest.place
  destPlaceCell.appendChild(destInput)
  destPlaceCell.appendChild(destLabel)

  row.appendChild(destPlaceCell)

  let deleteButtonCell = document.createElement('td')
  deleteButtonCell.className = 'deleteClass'
  deleteButtonCell.setAttribute('style', 'width: 10%')

  let deleteButton = document.createElement('i')
  deleteButton.type = 'button'
  deleteButton.value = ''
  deleteButton.id = 'deleteButton'
  deleteButton.className = 'fas'
  deleteButton.classList.add('fa-trash-alt')
  deleteButton.setAttribute('style', 'float: right; position: relative; top: 20px; right: 5px; cursor: pointer; font-size: 1.5rem;')

  deleteButtonCell.appendChild(deleteButton)

  row.appendChild(deleteButtonCell)
  document.getElementById('destinationTable').appendChild(row)
}

function addMarker (latLng, placeName, label) {
  let marker = new google.maps.Marker({
    position: latLng,
    map: map,
    label: label
    // animation: google.maps.Animation.DROP
  })
  markersOnMap.push(marker)
}

let clearMarkers = function () {
  for (let i = 0; i < markersOnMap.length; i++) {
    markersOnMap[i].setMap(null)
  }
  markersOnMap = []
}

let renderMarkers = function () {
  for (let j = 0; j < newTrip.destinationList.length; j++) {
    let marker = new google.maps.Marker({
      position: newTrip.destinationList[j].latLng,
      map: map,
      label: String(newTrip.destinationList[j].order)
    })
    markersOnMap.push(marker)
  }
}
