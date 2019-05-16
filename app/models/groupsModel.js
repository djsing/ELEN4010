'use strict'

let db = require('./db')

function returnGroupUsers (req, res) {
  let tripID = req.body.tripID
  groupQuery(tripID)
    .then(result => {
      // console.log('fetch members db: ', result.recordset)
      let members = result.recordset
      if (members.length !== 0) {
        groupMembersQuery(members)
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

function groupQuery (tripID) {
  return db.pools
    .then(pool => {
      let dbrequest = pool.request()
      dbrequest.input('tripID', db.sql.Char, tripID)
      return dbrequest
        .query(`SELECT * FROM groups WHERE trip_id = @tripID;`)
    })
}

function groupMembersQuery (members) {
  return db.pools
    .then(pool => {
      let queryString = groupMembersQueryString(members)
      return pool.request()
        .query(queryString)
    })
}

function groupMembersQueryString (members) {
  let queryString = `SELECT first_name, last_name, image_url FROM users WHERE hash IN (`
  members.forEach((member) => {
    queryString = queryString + `'${member.user_hash}',`
  })
  queryString = queryString.substring(0, queryString.length - 1)
  queryString = queryString + `);`
  // console.log('fetch Group Members from groups QS ', queryString)
  return queryString
}

module.exports = {
  returnGroupUsers: returnGroupUsers,
  groupMembersQuery: groupMembersQuery,
  groupMembersQueryString: groupMembersQueryString,
  groupQuery: groupQuery
}
