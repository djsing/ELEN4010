'use strict'

const mssql = require('mssql')
require('dotenv').config() // grab the ENV variables
let config = {
  // Put login details in env. variables for security
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_ADMIN,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  // Required for Azure
  options: {
    encrypt: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
}
// Get a mssql connection instance
let isConnected = true
let connectionError = null
let pools = new mssql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to DB')
    return pool
  })
  .catch(err => {
    // Handle errors
    isConnected = false
    connectionError = err
    console.log('connection error', err)
  });
// Upon connection, create user table if it doesn't exist
(function createUserTable () {
  pools.then((pool) => {
    return pool.request()
      // This is only a test query, change it to whatever you need
      .query(`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' and xtype='U')
          CREATE TABLE users (
          user_id int IDENTITY(1,1) PRIMARY KEY,
          first_name varchar(50),
          last_name varchar(50),
          email_address varchar(50) NOT NULL,
          image_url varchar(255),
          hash varchar(255) NOT NULL
          )`)
  }).then(result => {
    // console.log('user table created', result)
  }).catch(err => {
    console.log('user table creation error', err)
  })
}
)()

function createUser (userInfo, res) {
  let info = userInfo
  // console.log('create', info)
  pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query(`INSERT INTO users VALUES(
          '${info.firstName}',
          '${info.lastName}',
          '${info.emailAddress}',
          ${info.image},
          '${info.hash}')`)
    })
    // Send back the result
    .then(result => {
      // console.log('create users', result)
      // some info doesn't need to be sent to front-end
      delete info.userID
      delete info.hash
      // console.log('lastly new', info)
      res.send(info)
    })
    // If there's an error, return that with some description
    .catch(err => {
      console.log('create users error', err)
    })
}

function findUser (userInfo, signin, res) {
  let info = userInfo
  let email = info.emailAddress
  pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query(`SELECT *
        FROM users
        WHERE email_address = '${email}'`)
    })
    // both ID/Email match sought after in case of possible duplication of either ID/Email
    .then(result => {
      // console.log('query result', result)
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
        // console.log('changed to current')
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
          // some info doesn't need to be sent to front-end
          delete info.userID
          delete info.hash
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

module.exports = {
  sql: mssql,
  pools: pools,
  isConnected: isConnected,
  connectionError: connectionError,
  findUser: findUser
}
