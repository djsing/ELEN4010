const { OAuth2Client } = require('google-auth-library')
let keys = require('./keys.json')
let db = require('./db')

function googleUserAccountDatabaseConnection (req, res) {
  let token = req.body.idToken
  const client = new OAuth2Client(keys.web.client_id)
  var userid, firstName, lastName, emailAddress
  client.verifyIdToken({
    idToken: token,
    audience: keys.web.client_id
  }).then(result => {
    const payload = result.getPayload()
    userid = payload['sub']
    firstName = payload['given_name']
    lastName = payload['family_name']
    emailAddress = payload['email']
    // console.log('userID', userid)
    const user = db.findUser(userid)
    // console.log('user', user)
    var userInfo = {
      userID: userid,
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress
    }
    if (user === undefined) {
      userInfo.userType = 'newUser'
    } else {
      console.log('user exists')
    }
    // console.log(userInfo)
    res.send(userInfo)
  })
}

// if (userInfo.userType === 'currentUser') {
//   // return that things are normal and proceed to next page
// } else if (userInfo.userType === 'newUser') {
//   // create new acount
// } else {
//   console.log('Authentication error:', userInfo)
// }

module.exports = {
  googleUserAccountDatabaseConnection: googleUserAccountDatabaseConnection
}
