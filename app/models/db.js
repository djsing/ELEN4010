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
          user_id varchar(50),
          first_name varchar(50),
          last_name varchar(50),
          email_address varchar(50),
          image_url varchar(255)
          )`)
  }).then(result => {
    console.log('table created', result)
  }).catch(err => {
    console.log('table error', err)
  })
}
)()

function createGoogleUser (userInfo) {
  let info = userInfo
  pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query(`INSERT INTO users VALUES(
          ${info.userID},
          '${info.firstName}',
          '${info.lastName}',
          '${info.emailAddress}',
          '${info.image}')`)
    })
    // Send back the result
    .then(result => {
      return result
    })
    // If there's an error, return that with some description
    .catch(err => {
      return err
    })
}

function findUser (userInfo, res) {
  let info = userInfo
  let userID = info.userID
  pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query(`SELECT *
        FROM users
        WHERE user_id = ${userID}`)
    })
    // Send back the result
    .then(result => {
      // console.log('query result', result)

      // check if the ID/Email attributes in the db match the google-auth return
      for (let i = 0; i < result.recordset.length; i++) {
        let isCurrentUser = (result.recordset[i].user_id === info.userID) && (result.recordset[i].email_address === info.emailAddress)

        if (isCurrentUser) {
          info.userType = 'currentUser'
          break
        } else {
          info.userType = 'newUser'
        }
      }
      // if user isn't in database, create db entry for them
      if (info.userType === 'newUser') {
        createGoogleUser(info)
      }
      // ID doesn't need to be sent to front-end
      delete info.userID
      // console.log(info)
      res.send(info)
    })
    .catch(err => {
      return err
    })
}

module.exports = {
  sql: mssql,
  pools: pools,
  isConnected: isConnected,
  connectionError: connectionError,
  findUser: findUser,
  createUser: createUser
}
