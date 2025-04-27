Feature: Logging into the app

Scenario: The user is registered in the site
  Given A registered user
  When I fill the data in the form and press submit
  Then I am redirected to /home

Scenario: The user submits an empty form
  Given A registered user
  When I submit the empty form
  Then An error message should be shown

Scenario: The user is not registered in the site
  Given An unregistered user
  When I fill the form with an unregistered username
  Then An error message should be shown

Scenario: The user submits an incorrect password
  Given A registered user
  When I fill the form with an incorrect password
  Then An error message should be shown