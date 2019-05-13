'use strict'

let db = require('./db')

function addInvite (res, invite) {
  db.addToInvitesTable(res, invite.tripID, invite.emailAddress)
}

function getInvites (res, emailAddress) {
  let queryString = `SELECT trip_id FROM invites WHERE email_address = '${emailAddress}'`
  // console.log('getInvites QS', queryString)

  db.pools
    .then(pool => {
      return pool.request()
        .query(queryString)
    })
    .then(result => {
      console.log('Invites DB: ', result.recordset)
      let trips = result.recordset
      if (trips.length !== 0) {
        db.pools
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

function handleInvites (req, res, accept) {
  let triID = req.body.id
  let tripTitle = req.body.title
  let user = req.body.user
  let queryStringDelete = `DELETE FROM invites WHERE trip_id = ${triID};`

  let queryStringAdd = `DELETE FROM trips WHERE id = ${triID};` +
  `INSERT INTO trips VALUES(
      '${triID}',
      '${tripTitle}');` +
  `IF NOT EXISTS (SELECT * FROM groups
    WHERE user_hash = '${user}'
    AND trip_id = '${triID}')
    BEGIN
      INSERT INTO groups VALUES(
      '${user}',
      '${triID}')
    END;`

  // console.log(queryStringDelete)
  db.pools
    .then(pool => {
      return pool.request().query(queryStringDelete)
    })
    .then(result => {
      if (accept) {
        db.pools
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
  addInvite: addInvite,
  getInvites: getInvites,
  handleInvites: handleInvites
}
