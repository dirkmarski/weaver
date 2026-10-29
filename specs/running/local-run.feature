@issue-121
Feature: Run weaver locally with one command
  As someone who has just copied weaver to my computer,
  I want one command, written in the README, that starts it using only Node,
  so that I can play without installing anything else.
  The README's "View" section is where a player looks for how to run it.

  Scenario: The README tells how to run weaver
    Given the README's "View" section
    Then it gives the command "node tools/serve.js"
    And it says the command needs Node 22 or newer
    And it gives the address "http://localhost:8000"

  Scenario: The documented command serves the page with Node built-ins only
    When the command "node tools/serve.js" runs from the product folder
    Then the page at the documented address loads, with every file it asks for
    And the product needs no installed packages
