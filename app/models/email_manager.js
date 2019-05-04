let mailer = require('nodemailer')
let fs = require('fs')

let tripname = 'Family Getaway'
let htmlPage = eval('`' + fs.readFileSync('email.html', 'utf8') + '`')

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
    to: '1364103@students.wits.ac.za',
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

sendInvite()

module.exports = { sendInvite }
