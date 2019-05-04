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

let sendInvite = function (text) {
  let tripname = 'Family Getaway'
  let htmlPage = eval('`' + fs.readFileSync(path.join(__dirname, '/email.html'), 'utf8') + '`')

  let emailAddress = String(text)

  let helperOptions = {
    from: '"Away We Go" <awaywegoinvites@gmail.com',
    to: emailAddress,
    subject: 'Invite to collaborate on a trip',
    html: htmlPage
    // html: { path: 'app/views/email templates/email.html' }
  }

  transporter.sendMail(helperOptions, (err, inf) => {
    if (err) {
      return console.log(err)
    }
    console.log('The email got sent!')
  })
}

// sendInvite('1364103@students.wits.ac.za')

module.exports = { sendInvite }
