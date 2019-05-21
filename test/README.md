# Testing

This folder contins all the automated testing for the core functionality of the test. The testing framework used is Jest, and the end-end testing framework used is Selenium WebDriver. This file contains an overview of the tests perfomed in every test folder. 

## authenticate.test
This file tests:
- Generation of user hash keys
- Generation of Google user hash keys

## groups.test
This file tests the groups model, which is responsible for querying the database for data relating to groups of individuals who edit a given trip. These tests include:
- Testing the validity of the SQL query strings passed to the database for retrieving group members according to user hashes
- Testing the validity of the SQL query strings passed to the database for retrieving group members according to the trip ID 

## invites.test
Thiis file contains tests for the invites model, which is responsible for querying the databse for data relating to invites sent to email addresses. These tests include: 
- Adding invites to the invites table
- Getting invites for a particular user

## invitesFrontEnd.test
This file contains automated front-end testing for the invites modal on the website. This file tests: 
- The functionality of the "INVITE SOMEBODY TO JOIN THIS TRIP" button
- Front-end email format validation
- The validity of the confirmation message after an email is sent




