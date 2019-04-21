let db = require('./db.js')

const getTermsAndConditions = function () {
  // Get terms and conditions from databasez
  var request = new db.sql.Request(db.pools)
  request.query('select * from TermsAndConditions', function (recordset) {
    return recordset
  })
}
module.exports = getTermsAndConditions()
