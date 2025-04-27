Feature: Registering a new user

Scenario: The user is not registered in the site
  Given An unregistered user
  When I fill the data in the form and press submit
  Then I am redirected to /home

Scenario: The user submits an empty form
  Given An unregistered user
  When I submit the empty form
  Then An error message should be shown

Scenario: The user submits an already registered email
  Given A user with an email that is already registered
  When I fill the form with a repeated email
  Then An error message should be shown

Scenario: The user submits an invalid password
  Given An unregistered user
  When I fill the form with an invalid password
  Then An error message should be shown
  
Scenario: The user submits two passwords that do not match
  Given An unregistered user
  When I fill the form with two passwords that do not match
  Then An error message should be shown