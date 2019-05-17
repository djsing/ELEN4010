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
  // console.log(this.queryString)
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

    case 'SELECT * FROM groups WHERE trip_id = 0;':
      result = {
        recordset: [{
          user_hash: 'a1b2c3d4e5f6g7h8i9',
          trip_id: '123456789'
        }]
      }
      break

    case 'SELECT * FROM groups WHERE trip_id = 1;':
      result = {
        recordset: [{
          user_hash: 'a1b2c3d4e5f6g7h8i9',
          trip_id: '123456789'
        }, {
          user_hash: 'q1w2e3r4t5y6u7i8o9',
          trip_id: '987654321'
        }]
      }
      break

    case `SELECT first_name, last_name, image_url FROM users WHERE hash IN ('a1b2c3d4e5f6g7h8i9','q1w2e3r4t5y6u7i8o9');`:
      result = {
        recordset: [{
          first_name: 'Darrion',
          last_name: 'Singh',
          image_url: 'http://googleusers.com/darrionimage.jpg'
        }, {
          first_name: 'Tyson',
          last_name: 'Cross',
          image_url: null
        }]
      }
      break

    case 'DELETE FROM trips WHERE id = 0; INSERT INTO trips VALUES(0, My Trip); IF NOT EXISTS (SELECT * FROM groups WHERE user_hash = a1s2d3f4g5h6j7k8 AND trip_id = 0) BEGIN INSERT INTO groups VALUES(a1s2d3f4g5h6j7k8, 0) END;':
      result = {
        recordset: undefined
      }
      break

    case `SELECT * FROM groups WHERE user_hash = z1x2c3v4b5n6m7;`:
      result = {
        recordset: [{
          user_hash: 'z1x2c3v4b5n6m7',
          trip_id: '123456789'
        }, {
          user_hash: 'z1x2c3v4b5n6m7',
          trip_id: '987654321'
        }]
      }
      break
    default: break

    case `SELECT * FROM trips WHERE id IN ('1234','5678');`:
      result = {
        recordset: [{
          id: '0',
          title: 'My Trip'
        }, {
          id: '1',
          title: 'Your Trip'
        }]
      }
  }
  return new Promise((resolve, reject) => { resolve(result) })
}

let input = function (str, type, value) {
  this.replacements.push('@' + str)
  if (arguments.length === 2) {
    this.values.push(type)
  } else if (arguments.length === 3) { this.values.push(value) }
}

let pools = new Promise((resolve, reject) => { resolve(new Connection()) })
let sql = { Char: {} }
module.exports = {
  pools: pools,
  sql: sql
}
