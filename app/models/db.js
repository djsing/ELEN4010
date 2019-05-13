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
    // console.log('destinations table created', result)
  }).catch(err => {
    console.log('destinations table creation error', err)
  })
}
)();

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
}
)();

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

/* */

function populateDestionationsTable (res, queryString) {
  pools
    .then(pool => {
      return pool.request()
        .query(queryString)
    })
    .then(result => {
      // console.log('destination table population result ', result)
      res.send('DestinationTablePopulated')
    })
    .catch(err => {
      console.log('populate destination table error:', err)
    })
}

function addToInvitesTable (res, tripID, emailAddress) {
  pools
    .then(pool => {
      let id = tripID
      let email = emailAddress
      return pool.request()
        .query(`SELECT *
          FROM invites
          WHERE email_address = '${email}'
          AND trip_id = '${id}'`)
    })
    .then(result => {
      console.log('Invites select result ', result)
      if (result.recordset.length === 0) {
        // If this entry does's already exist in the table,
        // add it to the table
        let id = tripID
        let email = emailAddress
        pools
          .then(pool => {
            return pool.request()
              .query(`INSERT INTO invites VALUES(
                '${id}',
                '${email}');`)
          }).then(result => {
            console.log('Tries to add id: ' + id + ' and email: ' + email)
            console.log('Invites add result ', result)
          })
      }
    })
    .catch(err => {
      console.log('add invite table error:', err)
    })
}

function populateTripsAndGroupsTable (res, queryString, tripInfo) {
  pools
    .then(pool => {
      return pool.request()
        .query(queryString)
    })
    .then(result => {
      // console.log('trips and groups population result ', result)
      res.send(tripInfo)
    })
    .catch(err => {
      console.log('populate trips table error:', err)
    })
}

function getTripTitles (trips, res) {
  pools
    .then(pool => {
      if (trips.length !== 0) {
        let queryString = `SELECT * FROM trips WHERE id IN (`
        for (let i = 0; i < trips.length; i++) {
          queryString = queryString + `'${trips[i].trip_id}',`
        }
        queryString = queryString.substring(0, queryString.length - 1)
        queryString = queryString + `);`

        return pool.request()
          .query(queryString)
      }
    })
    .then(result => {
      // console.log('get trip titles result ', result)
      if (trips.legnth !== 0) { res.send(result.recordset) } else {
        res.send('NoTripTitlesFound')
      }
    })
    .catch(err => {
      console.log('Get trip titles error:', err)
    })
}

function getTrips (queryString, res) {
  pools
    .then(pool => {
      return pool.request()
        .query(queryString)
    })
    .then(result => {
      // console.log('get trips result ', result)
      if (result.recordset.length !== 0) {
        getTripTitles(result.recordset, res)
      }
    })
    .catch(err => {
      console.log('Get trips error:', err)
    })
}

// function getInvites (res, emailAddress) {
//   var invitesArray = []
//   pools
//     .then(pool => {
//       return pool.request()
//         .query(`SELECT trip_id
//         FROM invites
//         WHERE email_address = '${emailAddress}'`)
//     })
//     .then(result => {
//       result.recordset.forEach((trip) => {
//         let id = trip.trip_id
//         console.log(`Looking for name of ${id}`)
//         pools.then(pool => {
//           return pool.request()
//             .query(`SELECT *
//             FROM trips
//             WHERE id = '${id}'`)
//         })
//           .then(innerResult => {
//             console.log('Results from my function', innerResult.recordset[0])
//             invitesArray.push(innerResult.recordset[0])
//             console.log('The names of the trips are', invitesArray)
//             res.send(invitesArray)
//           })
//           .catch(err => {
//             console.log('Get trip titles error:', err)
//           })
//       })
//     })
//     .catch(err => {
//       console.log('Get trip_ids error:', err)
//     })
// }

function getInvites (res, queryString) {
  pools
    .then(pool => {
      return pool.request()
        .query(queryString)
    })
    .then(result => {
      console.log('Invites DB: ', result.recordset)
      let trips = result.recordset
      if (trips.length !== 0) {
        pools
          .then(pool => {
            let queryString = `SELECT * FROM trips WHERE id IN (`
            trips.forEach((trip) => {
              queryString = queryString + `'${trip.trip_id}',`
            })

            queryString = queryString.substring(0, queryString.length - 1)

            queryString = queryString + `);`
            console.log('get trip titles QS ', queryString)

            return pool.request()
              .query(queryString)
          })
          .then(result => {
            console.log('get trip titles result ', result)
            res.send(result.recordset)
          })
          .catch(err => {
            console.log('Get trip titles for invites error:', err)
          })
      } else {
        res.send(trips)
      }
    })
    .catch(err => {
      console.log('Get trip_ids error:', err)
    })
}

function handleInvites (queryStringDelete, queryStringAdd, accept, res) {
  pools
    .then(pool => {
      return pool.request().query(queryStringDelete)
    })
    .then(result => {
      if (accept) {
        pools
          .then(pool => {
            return pool.request().query(queryStringAdd)
          })
      }
    })
    .then(result => {
      if (accept) {
        res.send('InviteAccepted')
      } else {
        res.send('InviteRejected')
      }
    })
    .catch(err => {
      console.log('Delete invite error: ', err)
    })
}

module.exports = {
  sql: mssql,
  pools: pools,
  isConnected: isConnected,
  connectionError: connectionError,
  populateDestionationsTable: populateDestionationsTable,
  populateTripsAndGroupsTable: populateTripsAndGroupsTable,
  getTrips: getTrips,
  getTripTitles: getTripTitles,
  addToInvitesTable: addToInvitesTable,
  getInvites: getInvites,
  handleInvites: handleInvites
}
