'use strict'
jest.mock('../app/models/db')
let tripModel = require('../app/models/tripModel')

class Trip {
  constructor(id, title, destinations, user) {
    this.id = id
    this.title = title
    this.destinationList = destinations
    this.user = user
  }
}

class Destination {
  constructor(id, lat, lng, placeId, place, name, ordering) {
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
  let testTrip = new Trip(12345, "My Trip", [], 'A1B2C3D4E5F6')
  test('creating a trip object succeeds', () => {
    expect(testTrip.id).not.toBeNull()
    expect(testTrip.title).not.toEqual('')
    expect(testTrip.destinationList).toEqual([])
    expect(testTrip.user).toEqual('A1B2C3D4E5F6')
  })
})

describe('testing destination class data structures', () => {
  let testLatLng = { lat: 0, lng: 0 }
  let testDestination = new Destination(12345, 0, 0, 'A123', "My Destination", "testName", 1)
  test('creating a destination object succeeds', () => {
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

describe('testing createDestinationQueryString function', () => {
  let testTrip1 = new Trip(12345, "My Trip", [], 'A1B2C3D4E5F6')
  let testQS1 = `DELETE FROM destinations WHERE trip_id = 12345;`
  test('destination query string is correct when trip has no destinations', () => {
    expect(tripModel.createDestinationQueryString(testTrip1)).toEqual(testQS1)
  })

  let testDestination1 = new Destination(12345, 0, 0, 'A123', "My Destination", "testName", 1)
  let testTrip2 = new Trip(12345, "My Trip", [testDestination1], 'A1B2C3D4E5F6')
  let testQS2 = testQS1 + `INSERT INTO destinations VALUES ('12345',0,0,'A123','My Destination','testName',1,12345);`
  test('destination query string is correct when trip has one destination', () => {
    expect(tripModel.createDestinationQueryString(testTrip2)).toEqual(testQS2)
  })

  let testDestination2 = new Destination(12345, 0, 0, 'A123', "My Destination", "testName", 1)
  let testTrip3 = new Trip(12345, "My Trip", [testDestination1, testDestination2], 'A1B2C3D4E5F6')
  let testQS3 = testQS2 + `INSERT INTO destinations VALUES ('12345',0,0,'A123','My Destination','testName',1,12345);`
  test('destination query string is correct when trip has two destinations', () => {
    expect(tripModel.createDestinationQueryString(testTrip3)).toEqual(testQS3)
  })
})

describe('testing query functions', () => {
  test('testing createDestinationQuery', async () => {
    let testDestination = new Destination(12345, 0, 0, 'A123', "My Destination", "testName", 1)
    let testTrip = new Trip(12345, "My Trip", [testDestination], 'A1B2C3D4E5F6')
    let queryString = tripModel.createDestinationQueryString(testTrip)
    let createDestination = await tripModel.createDestinationQuery(queryString)
    expect(Object.keys(createDestination).length).toEqual(1)
    expect(createDestination.recordset).toEqual(undefined)
  })
})
