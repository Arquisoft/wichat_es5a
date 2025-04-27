Feature: Playing the game

Scenario: The user wants to play an easy game
  Given A registered user
  When I set the game mode to cities and the difficulty easy
  Then I get to play an easy cities game

Scenario: The user wants to play a medium game
  Given A registered user
  When I set the game mode to flags and the difficulty medium
  Then I get to play a medium flags game

Scenario: The user wants to play a difficult game
  Given A registered user
  When I set the game mode to football and the difficulty difficult
  Then I get to play a difficult football game

Scenario: The user wants to play a survival game
  Given A registered user
  When I set the game mode to music and the difficulty survival
  Then I get to play a survival music game

Scenario: The user needs a hint during a game
  Given A registered user
  When I play a game and click on the hint button
  Then I get a hint from the llm

Scenario: The user needs a chat assistant during a game
  Given A registered user
  When I play a game and click on the chat button
  Then I get to chat to the llm