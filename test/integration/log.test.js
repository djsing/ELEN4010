let logModel = require('../../app/models/logModel')
let db = require('../../app/models/db')

beforeEach(async ()=>{
    await db.pools
})

afterAll(()=>{
  db.pools.then(pool =>{
    pool.close()
  })
})

describe('testing log model', () => {
    let logItem = {
        id : '0',
        userId : 'random',
        code : 'random',
        date: 'random',
        importance : 'random',
        tripId : 'random'
    }
    let log = [logItem]

  test('log query string is correct when creating a new log', () => {

    let queryString = logModel.createLogQueryString(log)
    let expectedQueryString = `INSERT INTO log VALUES ('0','random','random','random','random','random');`
    expect(queryString).toEqual(expectedQueryString)
  })
})