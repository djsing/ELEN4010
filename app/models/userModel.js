'use strict'

let db = require('./db')
let SqlString = require('sqlstring')

function lookUpUser (req, res) {
  let hash = req.body.hash
  let queryString = SqlString.format('SELECT first_name, last_name FROM users WHERE hash = ?;', hash)
  db.getUserName(queryString, res)
}

function findUser (userInfo, signin, res) {
  let info = userInfo
  let email = info.emailAddress
  db.pools
    // Run query
    .then((pool) => {
      let dbrequest = pool.request()
      dbrequest.input('email', email)
      return dbrequest.query(`SELECT * FROM users WHERE email_address = @email`)
    })
    // both ID/Email match sought after in case of possible duplication of either ID/Email
    .then(result => {
      // if no match is found, it must be a new user
      if (result.recordset.length === 0) {
        info.userType = 'newUser'
        // if user doesn't exist and tries to sign in
        if (signin) {
          delete info.emailAddress
          delete info.password
          delete info.hash
          delete info.image
          delete info.firstName
          delete info.lastName
          res.send(info)
        } else {
          createUser(info, res)
        }
      } else {
        info.userType = 'currentUser'
        // account that does exist and is trying to register
        if (!signin) {
          // console.log('trying to register')
          delete info.emailAddress
          delete info.password
          delete info.hash
          delete info.image
          delete info.firstName
          delete info.lastName
          res.send(info)
        } else if (result.recordset[0].hash === info.hash) {
          // account that exists and is trying to sign in with the correct password
          // console.log('correct sign in')
          info.firstName = result.recordset[0].first_name
          info.lastName = result.recordset[0].last_name
          info.emailAddress = result.recordset[0].email_address
          info.hash = result.recordset[0].hash
          // console.log('lastly current', info)
          res.send(info)
        } else {
          // account that exists and is trying to sign in with the wrong password
          // console.log('incorrect sign in')
          info.userType = 'incorrectUser'
          // some info doesn't need to be sent to front-end
          delete info.emailAddress
          delete info.password
          delete info.hash
          delete info.image
          res.send(info)
        }
      }
    })
    .catch(err => {
      console.log('find user error', err)
    })
}

function createUser (userInfo, res) {
  let info = userInfo
  db.pools
    // Run query
    .then((pool) => {
      let dbrequest = pool.request()
      dbrequest.input('firstName', info.firstName)
      dbrequest.input('lastName', info.lastName)
      dbrequest.input('emailAddress', info.emailAddress)
      dbrequest.input('image', info.image)
      dbrequest.input('hash', info.hash)
      return dbrequest.query(`INSERT INTO users VALUES(@firstName,@lastName,@emailAddress,@image,@hash)`)
    })
    // Send back the result
    .then(result => {
      res.send(info)
    })
    // If there's an error, return that with some description
    .catch(err => {
      console.log('create users error', err)
    })
}

module.exports = {
  lookUpUser: lookUpUser,
  findUser: findUser
}
