let addTermsToSubsection = function (subsection, termsArray) {
  let list = document.createElement('ol')
  termsArray.forEach(element => {
    let item = document.createElement('li')
    let term = document.createTextNode(element)
    item.appendChild(term)
    list.appendChild(item)
  })
  subsection.append(list)
}

$(document).ready(() => {
  let preamble = ''
  let accounts = []
  $.ajax({
    url: '/terms_and_conditions/data',
    type: 'GET',
    success: (data) => {
      $('#Preamble').append(data.preamble)
      addTermsToSubsection($('#Accounts'), data.accounts)
    }
  })
})
