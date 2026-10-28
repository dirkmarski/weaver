@issue-108
Feature: Own pointing and claiming rewards state every step
  As a learner who applied pointing or claiming by myself,
  I want the reward to say what the step rules out and what that leaves,
  so that I can see why the cell holds that digit without working it out again.
  The message has two sentences: the technique and what it rules out, then what that leaves.
  Naked form: the step rules the digit out of the entered cell, leaving one digit there.
  Hidden form: the step leaves the entered cell as the only place for the digit in a named unit.

  Scenario: Own pointing, naked form
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
    When the player enters 7 in row 1, column 5 without a hint showing
    Then the message reads "Well spotted! You applied pointing on your own: in the box of rows 1-3 and columns 7-9, the digit 2 fits only in row 1, so 2 cannot go in row 1, column 5. That leaves 7 as the only digit there."
    And the message is shown as a reward
    And the "Pointing" line reads "Pointing: 1 on your own, 0 with a hint"

  Scenario: Own claiming, naked form
    Given this puzzle, where "." is an empty cell:
      | ..235.7.. |
      | 5..82..43 |
      | 3..4.9... |
      | ..863...1 |
      | ....853.6 |
      | 23...4... |
      | ..357.8.. |
      | ..4.....7 |
      | .7.1..... |
    And no technique has been applied yet in this puzzle
    When the player enters 6 in row 3, column 5 without a hint showing
    Then the message reads "Well spotted! You applied claiming on your own: in column 6, the digit 1 fits only in the box of rows 1-3 and columns 4-6, so 1 cannot go in row 3, column 5. That leaves 6 as the only digit there."
    And the message is shown as a reward
    And the "Claiming" line reads "Claiming: 1 on your own, 0 with a hint"

  Scenario: Own pointing, hidden form in a box
    Given this puzzle, where "." is an empty cell:
      | 7.14.62.. |
      | 436.2.5.. |
      | 2.91..4.. |
      | 6....8.4. |
      | .....1..5 |
      | .1...53.. |
      | .9...3.2. |
      | 3......1. |
      | ...7.4... |
    And no technique has been applied yet in this puzzle
    When the player enters 5 in row 4, column 3 without a hint showing
    Then the message reads "Well spotted! You applied pointing on your own: in the box of rows 1-3 and columns 1-3, the digit 5 fits only in column 2, so 5 cannot go anywhere else in column 2. That leaves row 4, column 3 as the only cell in the box of rows 4-6 and columns 1-3 where 5 fits."
    And the message is shown as a reward
    And the "Pointing" line reads "Pointing: 1 on your own, 0 with a hint"

  Scenario: Own claiming, hidden form in a row
    Given this puzzle, where "." is an empty cell:
      | ..23517.. |
      | 5..827.43 |
      | 3.7469... |
      | ..8632..1 |
      | ....853.6 |
      | 23...4... |
      | ..357.8.. |
      | ..4.....7 |
      | .7.1..... |
    And no technique has been applied yet in this puzzle
    When the player enters 2 in row 7, column 2 without a hint showing
    Then the message reads "Well spotted! You applied claiming on your own: in row 9, the digit 2 fits only in the box of rows 7-9 and columns 7-9, so 2 cannot go anywhere else in that box. That leaves row 7, column 2 as the only cell in row 7 where 2 fits."
    And the message is shown as a reward
    And the "Claiming" line reads "Claiming: 1 on your own, 0 with a hint"
