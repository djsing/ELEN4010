# 1. Testing

Date: 2019-05-20

## Status

Accepted

## Context

In order to holistically test the funtionality of the core aspects of the website, unit testing and end-to-end testing is used in order to test both the front-end and back-end functionality of the website. 

Unit tests are used to on back-end models and database-related code in order to validate the functionality of each essential unit (which, in most cases, are functions) of the code. 

On the front-end, various user actions on the are performed by automated testing software, and during that process, key aspects relating to the front-end side of the website are tested.

## Decision

The testing framework chosen for automated testing is Jest. This framework is because: 

- It has a simple installation and configuration process for Node.js
- Due to the its popularity as a javascript testing framework, it has a large developer-community which produces many articles, documents and forum threads (amongst many other sources of documentation and support)
- It has a wide variety of built-in assertion abilities (which means that there is no need for the installation of a third-party assertion library)

In order to simulate in-browser user-interactions with the website, Selenium WebDriver is used. One of the key reasons why it was initially chosen is due to it's ability work with multiple, common-used browsers. Front-end testing is performed on the https://testawaywego.azurewebsites.net website since this is the website used for development. 

Ultimately, it was decided that all automated front-end user testing will be performed using Google Chrome as the browser. The reason for this is due to the fact that Google Chrome has the highest market share (more than 60%) globally - meaning that a majrity of the website's users will be using Google Chrome. 

At multiple stages through-out the development process, manual testing on other major browsers (i.e. FireFox, Safari and Microsoft Edge) was also performed in order to ensure the cross-browser compatibility of the website. Manual testing was also used to ensure that the website is mobile-friendly.

## Consequences

The consequences and outcomes of the decision

 * An tests involving front-end user testing have to be performed on a computer connected to the internet
 * Automated user-interactions means that website will have to allow for all "bots" to interact with it. This is means that security-measures (e.g. reCAPTCHA) against harmful bots  cannot be implemented on the site. 
 * Potential bugs in other existing browsers (e.g. Opera, QQ, etc.) will not be covered in both manual and automated testing. 
