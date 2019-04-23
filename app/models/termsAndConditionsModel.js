let db = require('./db.js')
let termsAndCondtions = [
  'Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.',
  'By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.',
  'By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.',
  'When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service',
  'You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.',
  'You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.'
]

const getTermsAndConditions = function () {
  return termsAndCondtions
}
module.exports = getTermsAndConditions()
