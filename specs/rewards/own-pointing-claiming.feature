@issue-108 @issue-128 @issue-139
Feature: Own pointing and claiming rewards state every step
  As a learner who applied pointing or claiming by myself,
  I want the reward to say what the step rules out and what that leaves,
  so that I can see why the cell holds that digit without working it out again.
  The message has two sentences: the technique and what it rules out, then what that leaves.
  The technique clause names the cells where the digit fits: for pointing by line first ("row 1, columns 8 and 9"),
  for claiming by the other coordinate, then the box ("rows 1 and 2, inside the box of ...").
  Naked form: the step rules the digit out of the entered cell, leaving one digit there.
  Hidden form: the step rules the digit out of the named cells in the entered cell's unit (the cells there where it fitted before),
  leaving the entered cell as the only place for the digit in that unit, and says why the unit's other empty cells are out:
  it ends ", since <units> already has/have a D", the units listed as Hint step 3 lists them (boxes, then rows, then columns).
  If the step rules out every other empty cell of the unit, the message has no "since" part.
  In these messages every box range uses the non-breaking hyphen U+2011 ("1‑3"), never the plain "-", so a range never splits across lines.

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
    Then the message reads "Well spotted! You applied pointing on your own: in the top‑right box, the digit 2 fits only in row 1, columns 8 and 9, so 2 cannot go in row 1, column 5. That leaves 7 as the only digit there."
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
    Then the message reads "Well spotted! You applied claiming on your own: in column 6, the digit 1 fits only in rows 1 and 2, inside the top‑middle box, so 1 cannot go in row 3, column 5. That leaves 6 as the only digit there."
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
    Then the message reads "Well spotted! You applied pointing on your own: in the top‑left box, the digit 5 fits only in column 2, rows 1 and 3, so 5 cannot go in row 4, column 2. That leaves row 4, column 3 as the only cell in the middle‑left box where 5 fits, since rows 5 and 6 already have a 5."
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
    Then the message reads "Well spotted! You applied claiming on your own: in row 9, the digit 2 fits only in columns 7, 8 and 9, inside the bottom‑right box, so 2 cannot go in row 7, columns 8 and 9. That leaves row 7, column 2 as the only cell in row 7 where 2 fits, since columns 1 and 6 already have a 2."
    And the message is shown as a reward
    And the "Claiming" line reads "Claiming: 1 on your own, 0 with a hint"

  Scenario: Own pointing, hidden form in a column
    Given this puzzle, where "." is an empty cell:
      | 4.597.621 |
      | .2....... |
      | .......39 |
      | 85..1.3.6 |
      | .16.8.5.2 |
      | 34...5.18 |
      | 29.837.6. |
      | 5......8. |
      | ..8..12.3 |
    And no technique has been applied yet in this puzzle
    When the player enters 5 in row 2, column 8 without a hint showing
    Then the message reads "Well spotted! You applied pointing on your own: in the bottom‑middle box, the digit 5 fits only in row 9, columns 4 and 5, so 5 cannot go in row 9, column 8. That leaves row 2, column 8 as the only cell in column 8 where 5 fits, since rows 4 and 5 already have a 5."
    And the message is shown as a reward
    And the "Pointing" line reads "Pointing: 1 on your own, 0 with a hint"

  Scenario: Own pointing, hidden form: one box holds the digit
    Given this puzzle, where "." is an empty cell:
      | 5......4. |
      | 8...749.5 |
      | 6.4...8.. |
      | 4.796.... |
      | ...73.28. |
      | .....2..7 |
      | ..835.... |
      | ..36.9.1. |
      | 1.9.....6 |
    And no technique has been applied yet in this puzzle
    When the player enters 6 in row 5, column 3 without a hint showing
    Then the message reads "Well spotted! You applied pointing on your own: in the middle‑right box, the digit 6 fits only in row 6, columns 7 and 8, so 6 cannot go in row 6, column 3. That leaves row 5, column 3 as the only cell in column 3 where 6 fits, since the top‑left box already has a 6."
    And the message is shown as a reward
    And the "Pointing" line reads "Pointing: 1 on your own, 0 with a hint"

  Scenario: Own pointing, hidden form: a box and rows hold the digit
    Given this puzzle, where "." is an empty cell:
      | 27.4..... |
      | ..5...7.. |
      | .63....4. |
      | ......8.. |
      | 6...83..9 |
      | 3.8926... |
      | ..46..... |
      | ....9.638 |
      | 1..3..4.. |
    And no technique has been applied yet in this puzzle
    When the player enters 4 in row 2, column 1 without a hint showing
    Then the message reads "Well spotted! You applied pointing on your own: in the centre box, the digit 4 fits only in row 4, columns 5 and 6, so 4 cannot go in row 4, column 1. That leaves row 2, column 1 as the only cell in column 1 where 4 fits, since the bottom‑left box and rows 3 and 7 already have a 4."
    And the message is shown as a reward
    And the "Pointing" line reads "Pointing: 1 on your own, 0 with a hint"

  Scenario: Own pointing, hidden form: "an 8"
    Given this puzzle, where "." is an empty cell:
      | 42..8.1.9 |
      | 3....7..4 |
      | 17...42.. |
      | .3.9416.. |
      | ..76...8. |
      | .6......3 |
      | 781...... |
      | ....2.7.. |
      | ......... |
    And no technique has been applied yet in this puzzle
    When the player enters 8 in row 4, column 1 without a hint showing
    Then the message reads "Well spotted! You applied pointing on your own: in the top‑left box, the digit 8 fits only in column 3, rows 2 and 3, so 8 cannot go in row 4, column 3. That leaves row 4, column 1 as the only cell in row 4 where 8 fits, since the middle‑right box and column 8 already have an 8."
    And the message is shown as a reward
    And the "Pointing" line reads "Pointing: 1 on your own, 0 with a hint"

  Scenario: Own claiming, hidden form: one row holds the digit
    Given this puzzle, where "." is an empty cell:
      | ...79.26. |
      | .7.5...13 |
      | ....4.... |
      | 6...39..1 |
      | ....7..2. |
      | ....8.5.. |
      | .31.57..2 |
      | 95.....78 |
      | ..79..35. |
    And no technique has been applied yet in this puzzle
    When the player enters 1 in row 9, column 5 without a hint showing
    Then the message reads "Well spotted! You applied claiming on your own: in row 9, the digit 1 fits only in columns 5 and 6, inside the bottom‑middle box, so 1 cannot go in row 8, column 5. That leaves row 9, column 5 as the only cell in column 5 where 1 fits, since row 2 already has a 1."
    And the message is shown as a reward
    And the "Claiming" line reads "Claiming: 1 on your own, 0 with a hint"

  Scenario: Own pointing, hidden form: the step rules out every other empty cell
    Given this puzzle, where "." is an empty cell:
      | ..1..64.2 |
      | 67..24.18 |
      | 4231.89.6 |
      | 3..2.1.4. |
      | ......7.. |
      | ..65.9... |
      | ..4.9.1.. |
      | 9..4...6. |
      | .1....... |
    And no technique has been applied yet in this puzzle
    When the player enters 7 in row 3, column 8 without a hint showing
    Then the message reads "Well spotted! You applied pointing on your own: in the centre box, the digit 7 fits only in column 5, rows 4 and 6, so 7 cannot go in row 3, column 5. That leaves row 3, column 8 as the only cell in row 3 where 7 fits."
    And the message is shown as a reward
    And the "Pointing" line reads "Pointing: 1 on your own, 0 with a hint"
