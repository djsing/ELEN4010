require('../app/public/js/map.config')
require('../app/controllers/trip')
jest.mocks('Desination')
jest.mocks('countries')

test('creating a destination object succeeds', () => {
  let testDestination = new Destination( {lat:0,lng:0}, 'testPlace', 1 )
  let testLatLng = {lat:0, lng: 0}
  expect(testDestination.id).not.toBeNull()
  expect(testDestination.latLng).toEqual(testLatLng)
  expect(testDestination.place).not.toEqual('')
  expect(testDestination.order).toEqual(1)
})