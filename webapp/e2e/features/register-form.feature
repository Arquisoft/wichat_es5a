Feature: Registering a new user

Scenario: The user is not registered in the site
  Given An unregistered user
  When I fill the data in the form and press submit
  Then I am redirected to /home

Scenario: The user submits an empty form
  Given An unregistered user
  When I submit the empty form
  Then An error message should be shown