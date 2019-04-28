const { OAuth2Client } = require('google-auth-library')
let keys = require('./keys.json')
let db = require('./db')

function googleUserAccountDatabaseConnection (req, res) {
  let token = req.body.idToken
  const client = new OAuth2Client(keys.web.client_id)
  client.verifyIdToken({
    idToken: token,
    audience: keys.web.client_id
  }).then(result => {
    const payload = result.getPayload()
    const userid = payload['sub']
    var userInfo = {
      userID: userid,
      firstName: payload['given_name'],
      lastName: payload['family_name'],
      emailAddress: payload['email'],
      image: payload['picture']
    }
    db.findUser(userInfo, res)
  })
}

module.exports = {
  googleUserAccountDatabaseConnection: googleUserAccountDatabaseConnection
}
