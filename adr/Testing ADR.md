# 1. Testing

Date: 2019-05-20

## Status

Accepted

## Context

In order to holistically test the funtionality of the core aspects of the website, unit testing and end-to-end testing is used in order to test both the front-end and back-end functionality of the website. 

Unit tests are used on back-end models and database-related code in order to validate the functionality of each essential unit of the code (which, in most cases, are functions). 

On the front-end, various user actions are performed by automated testing software. During that process, key aspects relating to the front-end side of the website are tested.

## Decision

The testing framework chosen for automated testing is Jest. This framework is used because: 

- It has a simple installation and configuration process for Node.js
- Due to its popularity as a javascript testing framework, it has a large developer-community which produces many articles, documents and forum threads (amongst many other sources of documentation and support)
- It has a wide variety of built-in assertion abilities (which means that there is no need for the installation of a third-party assertion library)

In order to simulate in-browser user-interactions with the website, Selenium WebDriver is used. Front-end testing is performed on the https://testawaywego.azurewebsites.net website since it is the website used for development. 

Ultimately, it was decided that all automated front-end user testing will be performed using Google Chrome as the browser. The reason for this is due to the fact that Google Chrome has the highest browser market share (more than 60%) globally - meaning that a majrity of the website's users will be using Google Chrome. 

At multiple stages throughout the development process, manual testing on other major browsers (i.e. FireFox, Safari and Microsoft Edge) was also performed in order to ensure the cross-browser compatibility of the website. Manual testing was also used to ensure that the website is mobile-friendly.

## Consequences

The major consequences of the choice to include automated front-end browser testing include:

 * Any tests involving front-end user testing have to be performed on a computer connected to the internet
 * The website will have to allow for "bots" to interact with it. This means that security-measures (e.g. reCAPTCHA) against harmful bots  cannot be implemented on the site. 
 * Potential bugs in the website when viewed in other existing browsers (e.g. Opera, QQ, etc.) will not be detected in either automated or manual testing. 
