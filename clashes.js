// Clashes: the named clash, the cells to outline, the message when a clash is fixed.
import { findConflicts } from './validation.js';
import { firstHolder, cellName, UNIT_NAMES, toFlat } from './board.js';

// The clash named in the "not counted" and Hint texts, or null when no rule is broken: P is the first cell
// of findConflicts, Q its first holder (firstHolder). Returns { phrase, extra }: phrase is "row R1, column C1
// and row R2, column C2 both hold E in the same U" (P first, then Q, which comes later in reading order);
// extra is " Other numbers break the rules too: click Verify to see which." when more than two cells clash, else ''.
function namedClash(grid) {
  var conflicts = findConflicts(grid);
  if (!conflicts.length) return null;
  var p = conflicts[0][0] * 9 + conflicts[0][1], cells = toFlat(grid), e = cells[p], h = firstHolder(cells, p, e);
  return {
    phrase: cellName(p) + ' and ' + cellName(h.q) + ' both hold ' + e + ' in the same ' + UNIT_NAMES[h.unit],
    extra: conflicts.length > 2 ? ' Other numbers break the rules too: click Verify to see which.' : ''
  };
}

// Flat indices (row * 9 + column), ascending, of every cell to outline: the cells findConflicts returns, givens included.
function clashCells(grid) {
  return findConflicts(grid).map(function (p) { return p[0] * 9 + p[1]; });
}

var FIXED_TEXT = 'No numbers break the rules now. New entries are counted again.';

// The message for a value change from grid `before` to grid `after`: FIXED_TEXT when the change took the grid
// from at least one clash to none, else ''. (Only a clear or an overwrite can; completionFor takes precedence in the caller.)
function fixedMessage(before, after) {
  return findConflicts(before).length && !findConflicts(after).length ? FIXED_TEXT : '';
}

export { namedClash, clashCells, fixedMessage };
