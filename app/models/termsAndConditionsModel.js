let preamble = [
  'When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.',
  'You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.',
  'You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.'
]

let accounts = [
  'When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service',
  'You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service',
  'You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account'
]

let otherSites =
{
  name: 'Links To Other Web Sites',
  terms: [
    'Our Service may contain links to third-party web sites or services that are not owned or controlled by Away We Go',
    'Away We Go has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that Away We Go shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.',
    'We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.'
  ]
}

let getTermsAndCondtions = function () {
  let termsObj = { 'preamble': preamble,
    'accounts': accounts
  }
  return termsObj
}

module.exports = {
  getTermsAndCondtions
}
