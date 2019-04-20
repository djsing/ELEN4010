'use strict'
let path = require('path')

var terms = ['Be nice', 'Be kind', 'Have fun']

module.exports = function (req, res) {
  res.render(path.join(__dirname, '../views', 'terms_and_conditions'), { termList: terms })
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
