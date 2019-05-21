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

describe('testing map markers', () => {
    test('Marker can be found', async () => {
        // sign in to access trip page
        let email = await getElementById('inputEmail')
        email.sendKeys('r@r.com')
        let password = await getElementById('inputPassword')
        password.sendKeys('r') // correct password for email
        let button = await getElementById('signInPageSignInButton')
        button.click()


        // // A marker needs to exist on the map in order to be found. This can be done using 1 or 2:

        // // Option 1: create a marker on the map
        // location = await getElementById('pac-input')
        // location.sendKeys('Cape Town')
        // CT = await driver.wait(until.elementLocated(By.className('pac-container pac-logo')), waitUntilTime)
        // CT.click()

        // // Option 2: go to an existing trip on trip manager to load markers on trip page
        // driver.navigate().GoToUrl('https://testawaywego.azurewebsites.net/trip-manager')
        // title = await getElementById('Test trip')
        // title.click()
        // edit = await driver.wait(until.elementLocated(By.className('editTrip btn btn-sm btn-secondary')), waitUntilTime)
        // edit.click() // this redirects back to trip page with destinations loaded
        
        // // Find the marker on the map
        // map = await getElementById('map')
        // marker = await map.getAttribute('gmimap0')

        // // Check the attributes of the marker
        // actualShape = await marker.getAttribute('shape')
        // expectedShape = 'poly'
        // expect(actualShape).toEqual(expectedShape)

        // actualTitle = await el.getAttribute('title')
        // expectedTitle = ''
        // expect(actualTitle).toEqual(expectedTitle)

        // actualStyle = await el.getAttribute('style')
        // expectedStyle = 'cursor: pointer; touch-action: none;'
        // expect(actualStyle).toEqual(expectedStyle)
    })
})

afterAll(() => {
    driver.quit()
});