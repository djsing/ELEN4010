const { OAuth2Client } = require('google-auth-library')
const keys = require('./keys.json')
let db = require('./db')
const crypto = require('crypto')

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
    userInfo = createHashKey(userInfo, true)
    db.findUser(userInfo, res)
  })
}

function userAccountDatabaseConnection (req, res) {
  let userInfo = req.body
  userInfo = createHashKey(userInfo, false)
  db.findUser(userInfo, res)
}

function createHashKey (userInfo, isGoogleUser) {
  const hash = crypto.createHash('sha256')
  if (isGoogleUser) {
    hash.update(userInfo.userID + userInfo.password)
  } else {
    hash.update(userInfo.emailAddress + userInfo.password)
  }
  userInfo.hash = hash.digest('hex')
  console.log('after hash', userInfo)
  return userInfo
}

module.exports = {
  googleUserAccountDatabaseConnection: googleUserAccountDatabaseConnection,
  userAccountDatabaseConnection: userAccountDatabaseConnection
}
