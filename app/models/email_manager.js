let mailer = require('nodemailer')
let fs = require('fs')
let path = require('path')

require('dotenv').config()
let config = {
  emailUsername: process.env.EMAIL_USERNAME,
  emailPassword: process.env.EMAIL_PASSWORD,
  password: process.env.SITENAME
}

let transporter = mailer.createTransport({
  host: 'smtp.gmail.com',
  secure: true,
  port: 465,
  auth: {
    user: config.emailUsername,
    pass: config.emailPassword
  }
})

let sendInvite = function (emailAddress, tripName, invitee) {
  let trip = tripName
  let username = invitee
  let siteName = process.env.SITENAME
  let htmlPage = eval('`' + fs.readFileSync(path.join(__dirname, '/email.html'), 'utf8') + '`')

  let email = emailAddress

  let helperOptions = {
    from: '"Away We Go" <awaywegoinvites@gmail.com',
    to: email,
    subject: 'Invite to collaborate on a trip',
    html: htmlPage
  }

  transporter.sendMail(helperOptions, (err, inf) => {
    if (err) {
      return console.log(err)
    }
    // console.log('The email got sent!')
  })
}

module.exports = { sendInvite }
