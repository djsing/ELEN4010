'use strict'
jest.mock('../app/models/db')
let tripManagerModel = require('../app/models/tripManagerModel')


describe('testing getTripTitlesQueryString function', () => {
    let testTripArray1 = []
    let testQS1 = `SELECT * FROM trips WHERE id IN );`
    test('trip query string is correct when no trips exist', () => {
      expect(tripManagerModel.getTripTitlesQueryString(testTripArray1)).toEqual(testQS1)
    })

    let testTrip1 = {trip_id : 1234}
    let testTripArray2 = [testTrip1]
    let testQS2 = `SELECT * FROM trips WHERE id IN ('1234');`
    test('trip query string is correct when one trip exists', () => {
        expect(tripManagerModel.getTripTitlesQueryString(testTripArray2)).toEqual(testQS2)
    })

    let testTrip2 = {trip_id : 5678}
    let testTripArray3 = [testTrip1, testTrip2]
    let testQS3 = `SELECT * FROM trips WHERE id IN ('1234','5678');`
    test('trip query string is correct when one trip exists', () => {
        expect(tripManagerModel.getTripTitlesQueryString(testTripArray3)).toEqual(testQS3)
    })
})