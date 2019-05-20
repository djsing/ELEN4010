const { Builder, By, Key, until } = require('selenium-webdriver')

require('selenium-webdriver/chrome')

require('selenium-webdriver/firefox')

require('chromedriver')

require('geckodriver')

let termsAndConditionsModel = require('../app/models/termsAndConditionsModel')


const rootURL = 'https://testawaywego.azurewebsites.net/terms_and_conditions'

const d = new Builder().forBrowser('chrome').build()
const waitUntilTime = 20000
let driver, el, actual, expected
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5

test('waits for the driver to start', async () => {
    return d.then(_d => {
      driver = _d
    })
})
  
test('initialises the context', async () => {
    await driver.manage().window().setPosition(0, 0)
    await driver.manage().window().setSize(1280, 1024)
    await driver.get(rootURL)
})

async function getElementById(id) {
    driver.get(rootURL)
    const el = await driver.wait(until.elementLocated(By.id(id)), waitUntilTime)
    return await driver.wait(until.elementIsVisible(el), waitUntilTime)
}
  
async function getElementByXPath(xpath) {
    const el = await driver.wait(until.elementLocated(By.xpath(xpath)), waitUntilTime)
    return await driver.wait(until.elementIsVisible(el), waitUntilTime)
}

function concatenateTextArrayToParagraph(textArray) { 
    let paragraph = ''
    textArray.forEach((sentence) => {
        paragraph = paragraph  + sentence + ' '
    })
    // Remove the last white space
    paragraph = paragraph.substring(0, paragraph.length - 1)
    return paragraph
}

function removeHardReturnsInText(text) { 
    return text.replace(/(\n)/gm, ' ')
}

describe('testing if the terms and conditions on the webpage matches the text stored in the model', () => {
    test('accounts section on the webpage is correct', async () => {
        let expectedText = ''
        expectedText = concatenateTextArrayToParagraph(termsAndConditionsModel.getTermsAndCondtions().accounts)
        let preambleDiv = await getElementById('Accounts')
        let preambleText = await preambleDiv.getText()
        expect(removeHardReturnsInText(preambleText)).toEqual(expectedText) 
    })

    test('Links to other websites section on the webpage is correct', async () => {
        let expectedText = ''
        expectedText = concatenateTextArrayToParagraph(termsAndConditionsModel.getTermsAndCondtions().otherSites)
        let preambleDiv = await getElementById('OtherSites')
        let preambleText = await preambleDiv.getText()
        expect(removeHardReturnsInText(preambleText)).toEqual(expectedText) 
    })
})


afterAll(() => {
    driver.quit()
});