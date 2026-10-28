@issue-110
Feature: Rewards for singles found on your own
  As a learner, when I place a digit by myself using a single,
  I am told which technique I used and it is counted, so that I see my skills grow.
  An entry that is not a technique step is not counted, and the message says why.

  Background:
    Given this puzzle, where "." is an empty cell:
      | 4.59..6.. |
      | .2....... |
      | .......39 |
      | .5..1.... |
      | .16.8.5.. |
      | 34...5.18 |
      | ....37.6. |
      | 5......8. |
      | ..8..12.3 |
    And no technique has been applied yet in this puzzle

  Scenario: A naked single found on your own is rewarded and counted
    When the player enters 9 in row 7, column 2 without a hint showing
    Then the message reads "Well spotted! You found a naked single on your own: row 7, column 2 is 9."
    And the message is shown as a reward
    And the techniques applied read:
      | Naked single: 1 on your own, 0 with a hint  |
      | Hidden single: 0 on your own, 0 with a hint |
      | Pointing: 0 on your own, 0 with a hint      |
      | Claiming: 0 on your own, 0 with a hint      |

  Scenario Outline: A hidden single found on your own names its unit
    When the player enters <digit> in row <row>, column <column> without a hint showing
    Then the message reads "Well spotted! You found a hidden single in its <unit> on your own: row <row>, column <column> is <digit>."
    And the message is shown as a reward
    And the "Hidden single" line reads "Hidden single: 1 on your own, 0 with a hint"

    Examples:
      | row | column | digit | unit |
      | 1   | 9      | 1     | row  |
      | 4   | 1      | 8     | box  |

  Scenario: A digit already in the row is not counted
    When the player enters 4 in row 1, column 2 without a hint showing
    Then the message reads "Entered: row 1, column 2 is 4. 4 is already in this cell's row, at row 1, column 1, so it breaks the rules. It is not counted."
    And the message is shown as not counted
    And no technique count has changed

  Scenario: An entry that is not a technique step is not counted
    When the player enters 1 in row 2, column 1 without a hint showing
    Then the message reads "Entered: row 2, column 1 is 1. It was not a naked single, a hidden single, a pointing step or a claiming step at this point, so it is not counted."
    And the message is shown as not counted
    And no technique count has changed
