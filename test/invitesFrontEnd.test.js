const { Builder, By, Key, until } = require('selenium-webdriver')

require('selenium-webdriver/chrome')

require('selenium-webdriver/firefox')

require('chromedriver')

require('geckodriver')

const rootURL = 'https://testawaywego.azurewebsites.net/sign-in'

const d = new Builder().forBrowser('chrome').build()
const waitUntilTime = 20000
let driver, el, actual, expected
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5

async function getElementById(id) {
    const el = await driver.wait(until.elementLocated(By.id(id)), waitUntilTime)
    return await driver.wait(until.elementIsVisible(el), waitUntilTime)
}

async function getElementByClass(className) {
    const el = await driver.wait(until.elementLocated(By.className(className)), waitUntilTime)
    return await driver.wait(until.elementIsVisible(el), waitUntilTime)
}
  
async function getElementByXPath(xpath) {
    const el = await driver.wait(until.elementLocated(By.xpath(xpath)), waitUntilTime)
    return await driver.wait(until.elementIsVisible(el), waitUntilTime)
}

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


describe('test invites modal', () => {
    
    
    test('Invites modal appears when "INVITE SOMEBODY TO JOIN THIS TRIP" is pressed', async () => {
        let email = await getElementById('inputEmail')
        email.clear()
        email.sendKeys('r@r.com')
        let password = await getElementById('inputPassword')
        password.clear()
        password.sendKeys('r') // correct password for email
        let button = await getElementById('signInPageSignInButton')
        button.click()

        // wait for an element that is unique to the trip page to be found before getting the URL
        await getElementById('pac-input')

        let inviteSomebodyButton = await getElementById('inviteEditorButton')
        inviteSomebodyButton.click()
        let invitesModal = await getElementByClass('modal')
        let modalVisibility = invitesModal.isDisplayed()
        expect(modalVisibility).toBeTruthy()
    })

    test('test if an a warning message appears after an invalid email address is entered', async () => {
        let emailAddressField = await getElementById('emailAddressField')
        emailAddressField.clear()
        emailAddressField.sendKeys('invalidEmailAddress.com')

        let inviteButton = await getElementById('inviteEmailAddressButton')
        inviteButton.click()

        let warningMessgae = await getElementById('inviteEmailAddressButton')
        warningMessageVisibility = await warningMessgae.isDisplayed()

        expect(warningMessageVisibility).toBeTruthy()
    })

    test('test if an a warning message appears after an invalid email address is entered', async () => {
        let emailAddressField = await getElementById('emailAddressField')
        emailAddressField.clear()
        emailAddressField.sendKeys('invalidEmailAddress.com')

        let inviteButton = await getElementById('inviteEmailAddressButton')
        inviteButton.click()

        let warningMessgae = await getElementById('inviteEmailAddressButton')
        warningMessageVisibility = await warningMessgae.isDisplayed()
        
        expect(warningMessageVisibility).toBeTruthy()
    })
    test('test if an a "group invite send" message appears after a valid email address is entered', async () => {
        let emailAddressField = await getElementById('emailAddressField')
        emailAddressField.clear()
        emailAddressField.sendKeys('validEmailAddress@validEmailAddress.com')

        let inviteButton = await getElementById('inviteEmailAddressButton')
        inviteButton.click()

        let inviteSentMessage = await getElementById('inviteSendHeader')
        inviteSentMessageVisibility = await inviteSentMessage.isDisplayed()
        expect(inviteSentMessageVisibility).toBeTruthy()
    })
})
afterAll(() => {
    driver.quit()
});