Feature: Consulting the user profile

Scenario: The user wants to check the profile
  Given A registered user
  When I go to the profile 
  Then I get to see the username and email