let mailer = require('nodemailer')
let transporter = mailer.createTransport({
  host: 'smtp.gmail.com',
  secure: true,
  port: 465,
  auth: {
    user: 'awaywegoinvites@gmail.com',
    pass: 'Software3'
  }
})

let sendInvite = function (text) {
  let emailAddress = String(text)
  let tripname = 'New Trip'
  let helperOptions = {
    from: '"Away We Go" <awaywegoinvites@gmail.com',
    to: emailAddress,
    subject: 'Invite to collaborate on a trip',
    html: { path: 'app/views/email templates/email.html' }
  }

  transporter.sendMail(helperOptions, (err, inf) => {
    if (err) {
      return console.log(err)
    }
    console.log('The email got sent!')
  })
}

module.exports = { sendInvite }
