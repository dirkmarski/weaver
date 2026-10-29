@issue-122
Feature: Own pointing and claiming rewards mark the named cells on the board
  As a learner who applied pointing or claiming by myself,
  I want the board to show the box, rows, columns and cells the reward names,
  so that I can check the long message against the board instead of counting rows and columns.
  The marks are the ones a Hint explanation uses:
  amber = every cell of the box, of the row or column the step names first and, in the hidden form, of the unit the message ends with;
  dashed purple digit = the cells where the digit fits (named after "fits only in");
  struck grey digit = the cells named after "cannot go in", except the cell the player just filled.
  A key line under the board explains them. The lists of units and cells are in any order.

  Scenario: Own pointing, naked form: no struck cell
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
    When the player enters 7 in row 1, column 5 without a hint showing
    Then the amber area is:
      | the box of rows 1-3 and columns 7-9 |
      | row 1                               |
    And the dashed purple 2 marks:
      | row 1, column 8 |
      | row 1, column 9 |
    And no cell is struck
    And the key line reads "Key: amber = the box, rows and columns the message names; dashed purple = the only places for 2 in the box."

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
    When the player enters 5 in row 4, column 3 without a hint showing
    Then the amber area is:
      | the box of rows 1-3 and columns 1-3 |
      | column 2                            |
      | the box of rows 4-6 and columns 1-3 |
    And the dashed purple 5 marks:
      | row 1, column 2 |
      | row 3, column 2 |
    And the struck grey 5 marks:
      | row 4, column 2 |
    And the key line reads "Key: amber = the box, rows and columns the message names; dashed purple = the only places for 5 in the box; struck grey 5 = this step rules 5 out there."

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
    When the player enters 6 in row 3, column 5 without a hint showing
    Then the amber area is:
      | column 6                            |
      | the box of rows 1-3 and columns 4-6 |
    And the dashed purple 1 marks:
      | row 1, column 6 |
      | row 2, column 6 |
    And no cell is struck
    And the key line reads "Key: amber = the box, rows and columns the message names; dashed purple = the only places for 1 in the column."

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
    When the player enters 2 in row 7, column 2 without a hint showing
    Then the amber area is:
      | row 9                               |
      | the box of rows 7-9 and columns 7-9 |
      | row 7                               |
    And the dashed purple 2 marks:
      | row 9, column 7 |
      | row 9, column 8 |
      | row 9, column 9 |
    And the struck grey 2 marks:
      | row 7, column 8 |
      | row 7, column 9 |
    And the key line reads "Key: amber = the box, rows and columns the message names; dashed purple = the only places for 2 in the row; struck grey 2 = this step rules 2 out there."

  Scenario: The next entry clears the marks
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
    And the player has entered 7 in row 1, column 5 without a hint showing
    And the amber area is:
      | the box of rows 1-3 and columns 7-9 |
      | row 1                               |
    And the key line reads "Key: amber = the box, rows and columns the message names; dashed purple = the only places for 2 in the box."
    When the player enters 4 in row 1, column 2 without a hint showing
    Then the message is shown as not counted
    And no cell is marked
    And the key line is empty
