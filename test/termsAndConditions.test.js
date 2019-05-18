let termsAndConditionsModel = require('../app/models/termsAndConditionsModel')

describe('testing the model that supplies the terms and conditions', () => {
    test('test if the preamble is correct', () => {
        let preamble = [
            'When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.',
            'You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.',
            'You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.'
        ]
        expect(termsAndConditionsModel.preamble).toBe(preamble)
    })
})