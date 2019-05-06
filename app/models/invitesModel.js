'use strict'

let db = require('./db')

function addInvite (res, invite) {
  db.addToInvitesTable(res, invite.tripID, invite.emailAddress)
}

function getInvites (res, emailAddress) {
  db.getInvites(res, emailAddress)
}

module.exports = {
  addInvite: addInvite,
  getInvites: getInvites
}
