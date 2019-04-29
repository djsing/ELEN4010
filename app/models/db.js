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
    console.log(err)
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
          email_address varchar(50),
          image_url varchar(255),
          hash varchar(255)
          )`)
  }).then(result => {
    console.log('table created', result)
  }).catch(err => {
    console.log('table error', err)
  })
}
)()

function createGoogleUser (userInfo, res) {
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
          '${info.image}',
          '${info.hash}')`)
    })
    // Send back the result
    .then(result => {
      console.log('create google users', result)
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

function findUser (userInfo, res) {
  let info = userInfo
  let hash = info.hash
  pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query(`SELECT *
        FROM users
        WHERE hash = '${hash}'`)
    })
    // both ID/Email match sought after in case of possible duplication of either ID/Email
    .then(result => {
      // console.log('query result', result)
      // if no match is found, it must be a new user
      if (result.recordset.length === 0) {
        info.userType = 'newUser'
        // console.log('about to create', info)
        createGoogleUser(info, res)
      } else {
        info.userType = 'currentUser'
        // some info doesn't need to be sent to front-end
        delete info.userID
        delete info.hash
        // console.log('lastly current', info)
        res.send(info)
      }
    })
    .catch(err => {
      console.log('find google user', err)
    })
}

function createNormalUser (userInfo, res) {
  let info = userInfo
  console.log('create', info)
  pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query(`INSERT INTO users VALUES(
          '${info.firstName}',
          '${info.lastName}',
          '${info.emailAddress}',
          '${info.image}',
          '${info.hash}')`)
    })
    // Send back the result
    .then(result => {
      console.log('create users', result)
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

function findNormalUser (userInfo, res) {
  console.log('reg user', userInfo)
  let info = userInfo
  let hash = info.hash
  pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query(`SELECT *
        FROM users
        WHERE hash = '${hash}'`)
    })
    // both ID/Email match sought after in case of possible duplication of either ID/Email
    .then(result => {
      // console.log('query result', result)
      // if no match is found, it must be a new user
      if (result.recordset.length === 0) {
        info.userType = 'newUser'
        // console.log('about to create', info)
        createNormalUser(info, res)
      } else {
        info.userType = 'currentUser'
        // some info doesn't need to be sent to front-end
        delete info.userID
        delete info.hash
        // console.log('lastly current', info)
        res.send(info)
      }
    })
    .catch(err => {
      console.log('find google user', err)
    })
}

module.exports = {
  sql: mssql,
  pools: pools,
  isConnected: isConnected,
  connectionError: connectionError,
  findUser: findUser,
  findNormalUser: findNormalUser
}
