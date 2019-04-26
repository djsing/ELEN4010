const { OAuth2Client } = require('google-auth-library')
db = require('./db')

function authenticateToken (token) {
  const client = new OAuth2Client('770023573168-8lo6smmhtuifqt6enlcnsulssucf2eb0.apps.googleusercontent.com')
  async function verify () {
    const ticket = await client.verifyIdToken({
      idToken: token.body.idToken,
      audience: '770023573168-8lo6smmhtuifqt6enlcnsulssucf2eb0.apps.googleusercontent.com'
    })
    // console.log('ticket', ticket)
    const payload = ticket.getPayload()
    const userid = payload['sub']
    // console.log(userid)
  }
  verify().catch(console.error)
}

function connectToDataBase () {
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
      // This is only a test query, change it to whatever you need
        .query('SELECT 1')
    })
  // Send back the result
    .then(result => {
      res.status(200).send(result)
    })
  // If there's an error, return that with some description
    .catch(err => {
      res.status(500).send(err)
    })
}

module.exports = {
  authenticateToken: authenticateToken
}
