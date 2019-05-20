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

test('waits for the driver to start', async () => {
    return d.then(_d => {
      driver = _d
    })
})
  
test('initialises the context', async () => {
    await driver.manage().window().setPosition(0, 0)
    await driver.manage().window().setSize(1280, 1024)
    await driver.get(rootURL)

    await driver.executeScript('document.getElementById("inputEmail").setAttribute("value", "r@r.com")')
    await driver.executeScript('document.getElementById("inputPassword").setAttribute("value", "r")')
    await driver.executeScript('document.getElementById("signInPageSignInButton").click()')
})

async function getElementById(id) {
    driver.get(rootURL)
    const el = await driver.wait(until.elementLocated(By.id(id)), waitUntilTime)
    return await driver.wait(until.elementIsVisible(el), waitUntilTime)
}


describe('test invites modal', ()=> {
    test('test if invites modal pops up when "INVITE SOMEBODY TO JOIN THIS TRIP" button is pressed', async () => {
        inviteSomeonePopupButton = await getElementById('inviteEditorButton')
        inviteSomeonePopupButton.click() 
        inviteModal = await getElementByClass('modal')
        let isVisible = inviteModal.isDisplayed()
        expect(isVisible).toBeTruthy()
    })
    
})


afterAll(() => {
    driver.quit()
});