const { OAuth2Client } = require('google-auth-library')
const keys = require('./keys.json')
let userModel = require('./userModel')
const crypto = require('crypto')

function googleUserAccountDatabaseConnection (req, res) {
  const token = req.body.idToken
  const signin = req.body.signin
  const client = new OAuth2Client(keys.web.client_id)
  client.verifyIdToken({
    idToken: token,
    audience: keys.web.client_id
  }).then(result => {
    const payload = result.getPayload()
    const userid = payload['sub']
    const imageURL = '\'' + payload['picture'] + '\''
    var userInfo = {
      userID: userid,
      firstName: payload['given_name'],
      lastName: payload['family_name'],
      emailAddress: payload['email'],
      image: imageURL
    }
    userInfo = createHashKey(userInfo, true)
    userModel.findUser(userInfo, signin, res)
  })
}

function userAccountDatabaseConnection (req, res) {
  // console.log('req', req)
  let userInfo = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailAddress: req.body.emailAddress,
    password: req.body.password
  }
  const signin = req.body.signin
  userInfo.image = null
  userInfo = createHashKey(userInfo, false)
  userModel.findUser(userInfo, signin, res)
}

function createHashKey (userInfo, isGoogleUser) {
  const hash = crypto.createHash('sha256')
  if (isGoogleUser) {
    hash.update(userInfo.userID + userInfo.password)
  } else {
    hash.update(userInfo.emailAddress + userInfo.password)
  }
  userInfo.hash = hash.digest('hex')
  // console.log('after hash', userInfo)
  return userInfo
}

module.exports = {
  googleUserAccountDatabaseConnection: googleUserAccountDatabaseConnection,
  userAccountDatabaseConnection: userAccountDatabaseConnection
}
