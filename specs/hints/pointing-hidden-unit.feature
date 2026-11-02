@issue-111 @issue-128 @issue-135
Feature: The last step of a hidden-form explanation says why the unit's other cells are out
  As a learner reading a pointing or claiming explanation in the hidden form,
  I want the last step to name the row, column or box it means and say why the digit
  cannot go in that unit's other cells,
  so that I can make the same check on my own next time.
  Only step 3 of the hidden form changes; the nudge, steps 1 and 2 and the naked form stay as they are.
  Step 2's struck cells inside the unit are counted ("step 2 crossed out one cell"); every other
  empty cell of the unit is out because its row, column or box (checked in that order) already holds the digit;
  the reasons list the boxes first, then the rows, then the columns.

  Scenario Outline: Step 3 says why the unit's other cells are out
    Given the level is Tricky
    And this puzzle, where "." is an empty cell:
      | <r1> |
      | <r2> |
      | <r3> |
      | <r4> |
      | <r5> |
      | <r6> |
      | <r7> |
      | <r8> |
      | <r9> |
    And no technique has been applied yet in this puzzle
    When the player asks for a hint twice
    Then the explanation's last line reads "<step 3>"

    Examples: row, column and box units, one or two unit groups, a long list, two struck cells
      | r1        | r2        | r3        | r4        | r5        | r6        | r7        | r8        | r9        | step 3                                                                                                                                        |
      | 42..8.1.9 | 3....7..4 | 17...42.. | .3.9416.. | ..76...8. | .6......3 | 781...... | ....2.7.. | ......... | 3. In row 4, step 2 crossed out one cell; the middle‑right box and column 8 already have an 8. So 8 must go in row 4, column 1.               |
      | 27.4..... | ..5...7.. | .63....4. | ......8.. | 6...83..9 | 3.8926... | ..46..... | ....9.638 | 1..3..4.. | 3. In column 1, step 2 crossed out one cell; the bottom‑left box and rows 3 and 7 already have a 4. So 4 must go in row 2, column 1.          |
      | 4.597.6.1 | .2....... | ..7....39 | 85..1.3.6 | 716.8.5.2 | 34...5.18 | 2...37.6. | 5......8. | ..8..12.3 | 3. In the top‑left box, step 2 crossed out one cell; rows 1 and 3 already have a 9. So 9 must go in row 2, column 1.                          |
      | 7.14.62.. | 436.2.5.. | 2.91.74.. | 6....8.4. | .....1..5 | .1...53.. | .9...3.2. | 3......1. | ...7.4... | 3. In the middle‑left box, step 2 crossed out one cell; rows 5 and 6 already have a 5. So 5 must go in row 4, column 3.                       |
      | 2......96 | 86.1..2.5 | .5..7...4 | ..25...4. | .4..93..1 | ..1..69.. | 6........ | ..7..5... | ...964..2 | 3. In row 7, step 2 crossed out one cell; the bottom‑middle box and columns 2, 6, 8 and 9 already have a 4. So 4 must go in row 7, column 7. |
      | ..1..6..2 | .7..24..8 | 4.31.89.. | 3..2.1.4. | ......7.. | ..65.9... | ..4.9.1.. | 9..4...6. | .1....... | 3. In the top‑middle box, step 2 crossed out two cells; row 2 already has a 7. So 7 must go in row 1, column 4.                               |

    Examples: every other empty cell of the unit is struck
      | r1        | r2        | r3        | r4        | r5        | r6        | r7        | r8        | r9        | step 3                                                                                         |
      | 368.9.175 | 7415632.. | 925.7.634 | 892345761 | ...6.7.2. | 6.7.29... | ...75..1. | 576.3...2 | .......5. | 3. In column 5, step 2 crossed out the other empty cell. So 1 must go in row 5, column 5.       |
      | 5......93 | ..3..5.6. | .61...285 | ....2..79 | 7.6...53. | 3..8.7.4. | 137...926 | 6.5...314 | .4..36.5. | 3. In the bottom‑left box, step 2 crossed out every other empty cell. So 8 must go in row 8, column 2. |

  Scenario: The whole explanation, row case
    Given the level is Tricky
    And this puzzle, where "." is an empty cell:
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
    When the player asks for a hint twice
    Then the explanation reads:
      """
      Pointing: row 4, column 1 must be 8.
      1. In the top‑left box, the digit 8 fits only in column 3.
      2. So 8 cannot go in column 3 outside that box: not in column 3, rows 4 and 6 (struck).
      3. In row 4, step 2 crossed out one cell; the middle‑right box and column 8 already have an 8. So 8 must go in row 4, column 1.
      """

  Scenario: The whole explanation, claiming in the hidden form
    Given the level is Tough
    And this puzzle, where "." is an empty cell:
      | .6....17. |
      | 74.5.3... |
      | .25...63. |
      | 8..3.5761 |
      | .....7.2. |
      | 6.7.29... |
      | ...7...1. |
      | 5.6.3...2 |
      | .......5. |
    And no technique has been applied yet in this puzzle
    When the player asks for a hint twice
    Then the explanation reads:
      """
      Claiming: row 5, column 4 must be 6.
      1. In column 6, the digit 6 fits only in the bottom‑middle box.
      2. So 6 cannot go anywhere else in that box: not in row 7, column 5; row 9, columns 4 and 5 (struck).
      3. In column 4, step 2 crossed out one cell; rows 1, 3, 6 and 8 already have a 6. So 6 must go in row 5, column 4.
      """
