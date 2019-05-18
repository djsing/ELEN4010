let termsAndConditionsModel = require('../app/models/termsAndConditionsModel')
let fs = require('fs')
let path = require('path')


describe('testing the model that exports the correct terms and conditions', () => {
    test('test if the preamble stord in the model is correct', () => {
        let preamble = [
            'When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.',
            'You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.',
            'You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.'
        ]
        expect(termsAndConditionsModel.getTermsAndCondtions().preamble).toEqual(preamble)
    })

    test('test if the information stored about accounts is correct', () => {
        let accounts = [
            'When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service',
            'You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service',
            'You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account'
        ]
        expect(termsAndConditionsModel.getTermsAndCondtions().accounts).toEqual(accounts)
    })

    test('test if the information stored about other sites is correct', () => {
        let otherSites = [
            'Our Service may contain links to third-party web sites or services that are not owned or controlled by Away We Go',
            'Away We Go has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that Away We Go shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.',
            'We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.'
        ]
        expect(termsAndConditionsModel.getTermsAndCondtions().otherSites).toEqual(otherSites)
    })
})

describe('testing that the controller renders the data from the model onto the HTML page', () => {
    describe('testing that the addTermsToSubsection function adds the neccesary information to each HTML div', () =>{
        let testFolderRegex = /test/gi
        let rootDir = path.resolve(__dirname).replace(testFolderRegex, '')
        let termsAndConditionsHTMLDir = path.join(rootDir, '/app/views/terms_and_conditions.html')
        // Read in the HTML file
        document.body.innerHTML = fs.readFileSync(termsAndConditionsHTMLDir)
    
        require('../app/controllers/terms_and_conditions')
        const $ = require('jquery')
        
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
            
        test('preamble section is added to the div with id="Preamble"', () => {  // Get the directory of where the HTML file is for the T&Cs
            // An initial space is added to account for the fact that the preamble div's first HTML DOM child is a <p> element
            let preambleString = ' '
            // Construct the preamble string from the sentences returned by the model
            termsAndConditionsModel.getTermsAndCondtions().preamble.forEach((sentence) => {
                preambleString = preambleString + sentence
            })

            addTermsToSubsection($('#Preamble'), termsAndConditionsModel.getTermsAndCondtions().preamble, 'p')

            expect($('#Preamble').text()).toEqual(preambleString) 
        })
    })   
})