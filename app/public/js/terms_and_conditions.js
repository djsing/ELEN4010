$(document).ready(() => {
  let preamble = ''
  let accounts = []
  $.ajax({
    url: '/terms_and_conditions/data',
    type: 'GET',
    success: (data) => {
      $('#Preamble').append(data.preamble)
      $('#Accounts').append(data.accounts)
    }
  })
})
