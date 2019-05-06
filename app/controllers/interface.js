'use strict'

let markersOnMap = []

let drawDestination = function (dest) {
  let row = document.createElement('tr')
  row.id = dest.id
  row.className = 'destinationsTableRow'

  let destNum = document.createElement('td')
  destNum.innerHTML = String(dest.dest_order)
  destNum.classList.add('indexClass')
  destNum.setAttribute('style', 'width: 20%')
  row.appendChild(destNum)

  let destPlace = document.createElement('td')
  destPlace.innerHTML = dest.place
  destPlace.classList.add('destinationClass')
  row.appendChild(destPlace)

  let deleteButtonCell = document.createElement('td')
  let deleteButton = document.createElement('i')
  deleteButton.type = 'button'
  deleteButton.value = ''
  deleteButton.id = 'deleteButton'
  deleteButton.className = 'fas'
  deleteButton.classList.add('fa-trash-alt')
  deleteButton.setAttribute('style', 'float: right; cursor: pointer')
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
  addDestination(latLng, placeName)
  drawDestination(newTrip.destinationList[newTrip.destinationList.length - 1])
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
