'use strict'

let db = require('./db')

function addInvite (res, invite) {
  db.pools
    .then(pool => {
      let dbrequest = pool.request()
      dbrequest.input('id', invite.tripID)
      dbrequest.input('email', invite.emailAddress)
      return dbrequest
        .query(`SELECT *
        FROM invites
        WHERE email_address = @email
        AND trip_id = @id`)
    })
    .then(result => {
      // console.log('Invites select result ', result)
      if (result.recordset.length === 0) {
        // If this entry does's already exist in the table, add it to the table
        db.pools
          .then(pool => {
            let dbrequest = pool.request()
            dbrequest.input('id', invite.tripID)
            dbrequest.input('email', invite.emailAddress)
            return dbrequest
              .query(`INSERT INTO invites VALUES(
              @id,
              @email);`)
          }).then(result => {
            // console.log('Tries to add id: ' + id + ' and email: ' + email)
            // console.log('Invites add result ', result)
            res.send('inviteAdded')
          }).catch(err => {
            console.log('add invite error', err)
          })
      }
    })
    .catch(err => {
      console.log('add invite table error:', err)
    })
}

function getInvites (res, emailAddress) {
  db.pools
    .then(pool => {
      let dbrequest = pool.request()
      dbrequest.input('email', emailAddress)
      return dbrequest
        .query(`SELECT trip_id FROM invites WHERE email_address = @email`)
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

  db.pools
    .then(pool => {
      let dbrequest = pool.request()
      dbrequest.input('tripID', triID)
      return dbrequest
        .query(`DELETE FROM invites WHERE trip_id = @tripID;`)
    })
    .then(result => {
      if (accept) {
        db.pools
          .then(pool => {
            let dbrequest = pool.request()
            dbrequest.input('tripID', triID)
            dbrequest.input('tripTitle', tripTitle)
            dbrequest.input('user', user)
            return dbrequest
              .query(`DELETE FROM trips WHERE id = @tripID;` +
                `INSERT INTO trips VALUES(
                  @tripID,
                  @tripTitle);` +
                `IF NOT EXISTS (SELECT * FROM groups
              WHERE user_hash = @user
              AND trip_id = @tripID)
              BEGIN
                INSERT INTO groups VALUES(
                @user,
                @tripID)
              END;`)
          })
          .catch(err => {
            console.log('handle invites error', err)
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
