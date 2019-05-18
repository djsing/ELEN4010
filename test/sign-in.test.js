const { Builder, By, Key, until } = require('selenium-webdriver')

require('selenium-webdriver/chrome')

require('selenium-webdriver/firefox')

require('chromedriver')

require('geckodriver')

const rootURL = 'https://awaywego.azurewebsites.net/sign-in'

const d = new Builder().forBrowser('firefox').build()
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

test('waits for the driver to start', () => {
    return d.then(_d => {
      driver = _d
    })
})
  
test('initialises the context', async () => {
    await driver.manage().window().setPosition(0, 0)
    await driver.manage().window().setSize(1280, 1024)
    await driver.get(rootURL)
})


test('Email address placeholder is correct', async () => {
    el = await getElementById('inputEmail')
    actual = await el.getAttribute('placeholder')
    expected = 'Email address'
    expect(actual).toEqual(expected)
})

test('Password placeholder is correct', async () => {
    el = await getElementById('inputPassword')
    actual = await el.getAttribute('placeholder')
    expected = 'Password'
    expect(actual).toEqual(expected)
})

test('Remember password checkbox is not checked on page load', async () => {
    const el = await driver.wait(until.elementLocated(By.id('customCheck1')), waitUntilTime)
    actual = await el.isSelected()
    expected = false
    expect(actual).toEqual(expected)
})