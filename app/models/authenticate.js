const { OAuth2Client } = require('google-auth-library')

function authenticateToken (token) {
  const client = new OAuth2Client('770023573168-8lo6smmhtuifqt6enlcnsulssucf2eb0.apps.googleusercontent.com')
  async function verify () {
    const ticket = await client.verifyIdToken({
      idToken: token.body.idToken,
      audience: '770023573168-8lo6smmhtuifqt6enlcnsulssucf2eb0.apps.googleusercontent.com'
    })
    console.log('ticket', ticket)
    const payload = ticket.getPayload()
    const userid = payload['sub']
    console.log(userid)
  }
  verify().catch(console.error)
}

module.exports = {
  authenticateToken: authenticateToken
}
