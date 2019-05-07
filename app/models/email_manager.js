let mailer = require('nodemailer')
let fs = require('fs')
let path = require('path')

let transporter = mailer.createTransport({
  host: 'smtp.gmail.com',
  secure: true,
  port: 465,
  auth: {
    user: 'awaywegoinvites@gmail.com',
    pass: 'Software3'
  }
})

let sendInvite = function (emailAddress, tripName, invitee) {
  let trip = tripName
  let username = invitee
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
    console.log('The email got sent!')
  })
}

module.exports = { sendInvite }
