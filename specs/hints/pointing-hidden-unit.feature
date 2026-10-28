@issue-111
Feature: The pointing explanation names the unit in its last step
  As a learner reading a pointing explanation in the hidden form,
  I want the last step to name the row, column or box it means,
  so that I know where to look, as the claiming explanation already does.
  Only step 3 of the hidden form changes; the nudge, steps 1 and 2 and the naked form stay as they are.

  Scenario Outline: Step 3 names the row, column or box
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

    Examples:
      | r1        | r2        | r3        | r4        | r5        | r6        | r7        | r8        | r9        | step 3                                                                                                              |
      | 42..8.1.9 | 3....7..4 | 17...42.. | .3.9416.. | ..76...8. | .6......3 | 781...... | ....2.7.. | ......... | 3. That leaves row 4, column 1 as the only cell in row 4 where 8 fits, so it must be 8.                             |
      | 27.4..... | ..5...7.. | .63....4. | ......8.. | 6...83..9 | 3.8926... | ..46..... | ....9.638 | 1..3..4.. | 3. That leaves row 2, column 1 as the only cell in column 1 where 4 fits, so it must be 4.                          |
      | 4.597.6.1 | .2....... | ..7....39 | 85..1.3.6 | 716.8.5.2 | 34...5.18 | 2...37.6. | 5......8. | ..8..12.3 | 3. That leaves row 2, column 1 as the only cell in the box of rows 1-3 and columns 1-3 where 9 fits, so it must be 9. |

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
      1. In the box of rows 1-3 and columns 1-3, the digit 8 fits only in column 3.
      2. So 8 cannot go in column 3 outside that box: not in column 3, rows 4 and 6 (struck).
      3. That leaves row 4, column 1 as the only cell in row 4 where 8 fits, so it must be 8.
      """
