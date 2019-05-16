class Connection {
  constructor () {
    this.request = request
  }
}

class RequestObject {
  constructor () {
    this.query = query
  }
}

let request = function () {
  return new RequestObject()
}

let result = {
  recordset: [{
    id: '0',
    userId: 'random',
    code: '1',
    date: '2019-01-01',
    importance: 'True',
    tripId: 'random'
  }]
}

let query = function (queryString) {
  if (queryString === `INSERT INTO log VALUES ('0','random','1','2019-01-01','True','random');`) {
    return new Promise((resolve, reject) => { resolve(result) })
  }
}

let pools = new Promise((resolve, reject) => { resolve(new Connection()) })

module.exports = {
  pools: pools
}
