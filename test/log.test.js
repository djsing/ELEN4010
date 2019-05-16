jest.mock('../app/models/db')
let logModel = require('../app/models/logModel')

describe('testing createLog', () => {
    let logItem = {
        id : '0',
        userId : 'random',
        code : '1',
        date: '2019-01-01',
        importance : 'True',
        tripId : 'random'
    }
    let log = [logItem]

  test('createLogQueryString is correct when creating a new log', () => {
    let queryString = logModel.createLogQueryString(log)
    let expectedQueryString = `INSERT INTO log VALUES ('0','random','1','2019-01-01','True','random');`
    expect(queryString).toEqual(expectedQueryString)
  })

  test('testing createLogQuery', async ()=>{
    let queryString = logModel.createLogQueryString(log)
    let response = await logModel.createLogQuery(queryString)
    expect(response.recordset[0].id).toEqual('0')
    expect(response.recordset[0].userId).toEqual('random')
    expect(response.recordset[0].code).toEqual('1')
    expect(response.recordset[0].date).toEqual('2019-01-01')
    expect(response.recordset[0].importance).toEqual('True')
    expect(response.recordset[0].tripId).toEqual('random')
  })
})

