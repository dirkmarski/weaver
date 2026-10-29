@issue-127
Feature: Find where to play weaver online
  As someone who has just found weaver,
  I want the README to give the address where I can play it in a browser,
  so that I can start without copying or running anything.
  The README's "View" section is where a player looks for how to open it.

  Scenario: The README gives the online address
    Given the README's "View" section
    Then it gives the address "https://dirkmarski.github.io/weaver/"
