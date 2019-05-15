'use strict'
jest.mock('../app/models/db')
let tripModel = require('../app/models/tripModel')

class Trip {
  constructor (id, title, destinations, user) {
    this.id = id
    this.title = title
    this.destinationList = destinations
    this.user = user
  }
}

class Destination {
  constructor (id, lat, lng, placeId, place, name, ordering) {
    this.id = String(id)
    this.lat = Number(lat)
    this.lng = Number(lng)
    this.placeId = String(placeId)
    this.place = String(place)
    this.name = String(name)
    this.ordering = Number(ordering)
  }
}

describe('testing trip class data structures', () => {
  test('creating a trip object succeeds', () => {
    let testTrip = new Trip(12345, "My Trip", [], 'A1B2C3D4E5F6' )
    expect(testTrip.id).not.toBeNull()
    expect(testTrip.title).not.toEqual('')
    expect(testTrip.destinationList).toEqual([])
    expect(testTrip.user).toEqual('A1B2C3D4E5F6')
  })
})

describe('testing destination class data structures', () => {
  let testLatLng = {lat:0, lng: 0}

  test('creating a destination object succeeds', () => {
    let testDestination = new Destination(12345, 0, 0, 'A123', "My Destination", "testName", 1 )
    expect(testDestination.id).not.toBeNull()
    expect(testDestination.lat).toEqual(testLatLng.lat)
    expect(testDestination.lng).toEqual(testLatLng.lng)
    expect(testDestination.placeId).not.toEqual(undefined)
    expect(testDestination.place).not.toEqual('')
    expect(testDestination.place).not.toBeNull()
    expect(testDestination.name).not.toBeNull()
    expect(testDestination.ordering).toEqual(1)
  })
})
