'use strict'

let db = require('./db')

function addInvite (res, invite) {
  db.addToInvitesTable(res, invite.tripID, invite.emailAddress)
}

function getInvites (res, emailAddress) {
  db.getInvites(res, emailAddress)
}

function handleInvites (req, res, accept) {
  if (accept) {
    console.log('Accept')
  } else {
    console.log('Reject')
  }
}

module.exports = {
  addInvite: addInvite,
  getInvites: getInvites,
  handleInvites: handleInvites
}
