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

// afterEach(async () => {
//     driver.close()
// })

describe('testing page elements on page load', () => {
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
})

describe('test successful sign in', () => {
    test('User directed to trips page on successful sign in', async () => {
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
        let actual = await driver.getCurrentUrl()
        let expected = 'https://awaywego.azurewebsites.net/trip'
        expect(actual).toEqual(expected)
    })
})

// describe('test failed sign in', () => {
//     test('User not directed to trips page when password is incorrect', async () => {
//         let correctEmail = await getElementById('inputEmail')
//         correctEmail.sendKeys('m@m.com')
//         let wrongPassword = await getElementById('inputPassword')
//         wrongPassword.sendKeys('xxxxx') // wrong password for email
//         let button = await getElementById('signInPageSignInButton')
//         button.click()

//         // alert appears telling user that password is incorrect
//         let alert = await driver.switchTo().alert()
//         let actualAlert = alert.getText()
//         let expectedAlert = 'Your password is incorrect.'
//         expect(actualAlert).toEqual(expectedAlert)
//         alert.accept()
    
//         // page does not redirect to trips
//         let actual = await driver.getCurrentUrl()
//         let expected = 'https://awaywego.azurewebsites.net/sign-in'
//         expect(actual).toEqual(expected) 
//     })
// })

afterAll(() => {
    driver.quit()
});