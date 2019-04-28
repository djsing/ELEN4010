const { OAuth2Client } = require('google-auth-library')
let keys = require('./keys.json')
let db = require('./db')

function authenticateUser (token) {
  let payload, userid, user, userType
  const client = new OAuth2Client(keys.web.client_id)
  async function verify () {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: keys.web.client_id
    })
    payload = ticket.getPayload()
  }
  verify().then(() => {
    userid = payload['sub']
    // console.log('userID', userid)
    user = db.findUser(userid)
    // console.log('user', user)
  }).catch(console.error)

  switch (user) {
    case undefined: userType = 'newUser'
      break
  }
  return userType
}

function userAccountDatabaseConnection (req) {
  let token = req.body.idToken
  let userType = authenticateUser(token)

  if (userType === 'currentUser') {
    // return that things are normal and proceed to next page
  } else if (userType === 'newUser') {
    // create new acount
  } else {

  }
  // db.pools
  // // Run query
  //   .then((pool) => {
  //     return pool.request()
  //     // This is only a test query, change it to whatever you need
  //       .query('SELECT 1')
  //   })
  // // Send back the result
  //   .then(result => {
  //     res.status(200).send(result)
  //   })
  // // If there's an error, return that with some description
  //   .catch(err => {
  //     res.status(500).send(err)
  //   })
  return userType
}

module.exports = {
  userAccountDatabaseConnection: userAccountDatabaseConnection
}
