$(document).ready(() => {
  $.ajax({
    url: '/terms_and_conditions/data',
    type: 'GET',
    success: (data) => {
      console.log(data)
    }
  })
  $('#Preamble').append('Preable section')

  $('#Accounts').append('Term and conditions about accounts')
})
