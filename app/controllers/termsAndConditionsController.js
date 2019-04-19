module.exports = function (app) {
  app.get('/terms_and_conditions', function (req, res) {
    res.render('terms_and_conditions')
  })
}
