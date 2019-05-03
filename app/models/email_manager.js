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

let helperOptions = {
  from: '"Away We Go" <awaywegoinvites@gmail.com',
  to: '1364103@students.wits.ac.za',
  subject: 'Invite to collaborate on a trip',
  text: 'You have been invited to collaborate on a trip!'
}

let sendInvite = function () {
  transporter.sendMail(helperOptions, (err, inf) => {
    if (err) {
      return console.log(err)
    }
    console.log('The email got sent!')
  })
}

module.exports = { sendInvite }
