'use strict'

const $ = window.$

let addTermsToSubsection = function (subsection, termsArray, divider) {
  let parentItemType = ''
  if (divider === 'li') {
    parentItemType = 'ol'
  } else {
    parentItemType = 'p'
  }
  let parentItem = document.createElement(parentItemType)
  termsArray.forEach(element => {
    let item = document.createElement(divider)
    let term = document.createTextNode(element)
    item.appendChild(term)
    parentItem.appendChild(item)
  })
  subsection.append(parentItem)
}

$(document).ready(() => {
  $.ajax({
    url: '/terms_and_conditions/data',
    type: 'GET',
    success: (data) => {
      addTermsToSubsection($('#Preamble'), data.preamble, 'p')
      addTermsToSubsection($('#Accounts'), data.accounts, 'li')
      addTermsToSubsection($('#OtherSites'), data.otherSites, 'li')
    }
  })
})
