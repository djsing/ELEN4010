'use strict'

let db = require('./db')

function returnGroupUsers (req, res) {
  let tripID = req.body.tripID
  db.pools
    .then(pool => {
      let dbrequest = pool.request()
      dbrequest.input('tripID', db.sql.Char, tripID)
      return dbrequest
        .query(`SELECT * FROM groups WHERE trip_id = @tripID;`)
    })
    .then(result => {
      // console.log('fetch members db: ', result.recordset)
      let members = result.recordset
      if (members.length !== 0) {
        db.pools
          .then(pool => {
            let queryString = `SELECT first_name, last_name, image_url
            FROM users WHERE hash IN (`
            members.forEach((member) => {
              queryString = queryString + `'${member.user_hash}',`
            })
            queryString = queryString.substring(0, queryString.length - 1)
            queryString = queryString + `);`
            // console.log('fetch Group Members from groups QS ', queryString)

            return pool.request()
              .query(queryString)
          })
          .then(result => {
            // console.log('get group members result ', result.recordset)
            res.send(result.recordset)
          })
      } else {
        res.send(members)
      }
    })
    .catch(err => {
      console.log('fetch Group Members error', err)
    })
}

module.exports = {
  returnGroupUsers: returnGroupUsers
}
