'use strict'
let path = require('path')
let terms = require('../models/termsAndConditionsModel')

module.exports = function (req, res) {
  res.render(path.join(__dirname, '../views', 'terms_and_conditions'), { termList: terms.termsAndCondtions, preamble: terms.preamble })
  // res.sendFile(path.join(__dirname, '../views', 'terms_and_conditions.html'))
}

/*
function displayTermsAndConditions () {
  termsList.forEach(function (term) {
    var text = document.createTextNode(term)
    var listElement = document.createElement('LI')
    listElement.appendChild(text)
    document.getElementById('termsAndConditionsList').appendChild(listElement)
  })
}
*/
