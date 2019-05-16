'use strict'
/* DATABASE SET UP */
const mssql = require('mssql')
require('dotenv').config()
let config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_ADMIN,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  options: {
    encrypt: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
}

/* Get a mssql connection instance */
let isConnected = true
let connectionError = null
let pools = new mssql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to DB')
    return pool
  })
  .catch(err => {
    isConnected = false
    connectionError = err
    console.log('connection error', err)
  });

/* Create Database Tables */

(function createUserTable () {
  pools.then((pool) => {
    return pool.request()
      // This is only a test query, change it to whatever you need
      .query(`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' and xtype='U')
          CREATE TABLE users (
          first_name varchar(50),
          last_name varchar(50),
          email_address varchar(50) NOT NULL,
          image_url varchar(255),
          hash varchar(255) PRIMARY KEY NOT NULL
          )`)
  }).then(result => {
    // console.log('user table created', result)
  }).catch(err => {
    console.log('user table creation error', err)
  })
}
)();

(function createDestinationTable () {
  pools.then((pool) => {
    return pool.request()
      .query(`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='destinations' and xtype='U')
          CREATE TABLE destinations (
          id varchar(255) PRIMARY KEY, 
          lat float,
          lng float,
          place_id varchar(255),
          place varchar(255),
          name varchar(50),
          ordering int,
          trip_id varchar(255)
          )`)
  }).then(result => {
  }).catch(err => {
    console.log('destinations table creation error', err)
  })
})();

(function createInvitesTable () {
  pools.then((pool) => {
    return pool.request()
      .query(`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='invites' and xtype='U')
          CREATE TABLE invites (
          trip_id varchar(255), 
          email_address varchar(255)
          )`)
  }).then(result => {
    // console.log('invites table created', result)
  }).catch(err => {
    console.log('invites table creation error', err)
  })
})();

(function createTripTable () {
  pools.then((pool) => {
    return pool.request()
      .query(`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='trips' and xtype='U')
          CREATE TABLE trips (
          id varchar(255) PRIMARY KEY, 
          title varchar(50)
          )`)
  }).then(result => {
    // console.log('trips table created', result)
  }).catch(err => {
    console.log('trips table creation error', err)
  })
}
)();

(function createGroupsTable () {
  pools.then((pool) => {
    return pool.request()
      .query(`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='groups' and xtype='U')
          CREATE TABLE groups (
          user_hash varchar(255), 
          trip_id varchar(255)
          )`)
  }).then(result => {
    // console.log('groups table created', result)
  }).catch(err => {
    console.log('groups table creation error', err)
  })
}
)();

(function createLogTable () {
  pools.then((pool) => {
    return pool.request()
      .query(`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='log' and xtype='U')
          CREATE TABLE log (
          id varchar(255) PRIMARY KEY, 
          userId varchar(255),
          code tinyint,
          date smalldatetime,
          importance bit,
          trip_id varchar(255)
          )`)
  }).then(result => {
  }).catch(err => {
    console.log('log table creation error', err)
  })
}
)()

module.exports = {
  sql: mssql,
  pools: pools,
  isConnected: isConnected,
  connectionError: connectionError
}
