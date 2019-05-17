class Connection {
  constructor () {
    this.request = request
  }
}

class RequestObject {
  constructor () {
    this.query = query
    this.input = input
    this.replacements = []
    this.values = []
  }
}

let request = function () {
  return new RequestObject()
}

let query = function (queryString) {
  let result = {}
  let str = queryString
  for (let i = 0; i < this.replacements.length; i++) {
    let regex = new RegExp(this.replacements[i], 'g')
    str = str.replace(regex, this.values[i])
  }
  this.queryString = str
  switch (this.queryString) {
    // Inserting does not return anything
    case `INSERT INTO log VALUES ('0','random','1','2019-01-01','True','random');`:
      result = {
        recordset: undefined
      }
      break
      // Selecting returns results
    case 'SELECT id, userId, code, date, importance, trip_id, first_name, last_name FROM log JOIN users ON log.userid = users.hash WHERE trip_id = 0;':
      result = {
        recordset: [{
          id: '0',
          userId: 'random',
          code: '1',
          date: '2019-01-01',
          importance: 'True',
          tripId: 'random'
        }]
      }
      break

    default: break
  }
  return new Promise((resolve, reject) => { resolve(result) })
}

let input = function (str, value) {
  this.replacements.push('@' + str)
  this.values.push(value)
}

let pools = new Promise((resolve, reject) => { resolve(new Connection()) })

module.exports = {
  pools: pools
}
