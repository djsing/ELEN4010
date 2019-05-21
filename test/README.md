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

