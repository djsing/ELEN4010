'use strict'
jest.mock('../app/models/db')
let tripManagerModel = require('../app/models/tripManagerModel')


describe('testing getTripTitlesQueryString function', () => {
    let testTrip1 = { trip_id: 1234 }
    let testTripArray2 = [testTrip1]
    let testQS2 = `SELECT * FROM trips WHERE id IN ('1234');`
    test('trip query string is correct when one trip exists', () => {
        expect(tripManagerModel.getTripTitlesQueryString(testTripArray2)).toEqual(testQS2)
    })

    let testTrip2 = { trip_id: 5678 }
    let testTripArray3 = [testTrip1, testTrip2]
    let testQS3 = `SELECT * FROM trips WHERE id IN ('1234','5678');`
    test('trip query string is correct when more than one trip exists', () => {
        expect(tripManagerModel.getTripTitlesQueryString(testTripArray3)).toEqual(testQS3)
    })
})

describe('testing tripManagerModel query functions', () => {
    let tripInfo = {
        id: 0,
        title: 'My Trip',
        user: 'a1s2d3f4g5h6j7k8'
    }

    test('testing populateTripAndGroupTableQuery', async () => {
        let tableResult = await tripManagerModel.populateTripAndGroupTableQuery(tripInfo)
        expect(Object.keys(tableResult).length).toEqual(1)
        expect(tableResult.recordset).toEqual(undefined)
    })

    test('testing getTripsQuery', async () => {
        let user = 'z1x2c3v4b5n6m7'
        let groups = await tripManagerModel.getTripsQuery(user)
        expect(groups.recordset[0].user_hash).toEqual('z1x2c3v4b5n6m7')
        expect(groups.recordset[1].user_hash).toEqual('z1x2c3v4b5n6m7')
        expect(groups.recordset[0].trip_id).toEqual('123456789')
        expect(groups.recordset[1].trip_id).toEqual('987654321')
    })

    test('testing getTripTitlesQuery', async () => {
        let testTrip1 = { trip_id: 1234 }
        let testTrip2 = { trip_id: 5678 }
        let testTripArray3 = [testTrip1, testTrip2]
        let titles = await tripManagerModel.getTripTitlesQuery(testTripArray3)
        expect(titles.recordset[0].id).toEqual('0')
        expect(titles.recordset[1].id).toEqual('1')
        expect(titles.recordset[0].title).toEqual('My Trip')
        expect(titles.recordset[1].title).toEqual('Your Trip')
    })

    test('testing getDestinationsQuery', async ()=>{
        let tripId = 1
        let trip = await tripManagerModel.getDestinationsQuery(tripId)
        expect(trip.recordset[0].id).toEqual('1')
        expect(trip.recordset[0].lat).toEqual('0')
        expect(trip.recordset[0].lng).toEqual('0')
        expect(trip.recordset[0].place_id).toEqual('place12345')
        expect(trip.recordset[0].place).toEqual('London')
        expect(trip.recordset[0].name).toEqual('Family visit')
        expect(trip.recordset[0].ordering).toEqual(1)
        expect(trip.recordset[0].trip_id).toEqual('1')
        expect(trip.recordset[1].id).toEqual('2')
        expect(trip.recordset[1].lat).toEqual('1')
        expect(trip.recordset[1].lng).toEqual('1')
        expect(trip.recordset[1].place_id).toEqual('place54321')
        expect(trip.recordset[1].place).toEqual('Manchester')
        expect(trip.recordset[1].name).toEqual('Football stadium visit')
        expect(trip.recordset[1].ordering).toEqual(2)
        expect(trip.recordset[1].trip_id).toEqual('1')
    })
})