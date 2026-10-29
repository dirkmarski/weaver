// Completion: what to announce once the grid is full.
import { findConflicts } from './validation.js';

// Decides what to announce once a value change has been made.
// grid: givens plus entered values (0 = empty); tally: as from creditEntry,
// already including the entry that was just made. Inputs are not changed.
// Returns {kind: 'solved'|'conflict', text} or null while any cell is empty.
function completionFor(grid, tally) {
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) if (!grid[r][c]) return null;
  }
  if (findConflicts(grid).length) {
    return { kind: 'conflict', text: 'Every cell is filled, but some numbers break the rules. Click Verify to see which.' };
  }
  var own = 0, hint = 0;
  ['naked', 'hidden', 'pointing', 'claiming'].forEach(function (k) { own += tally[k].own; hint += tally[k].hint; });
  return { kind: 'solved', text: 'Puzzle solved! Techniques applied: ' + own + ' on your own, ' + hint + ' with a hint.' };
}

export { completionFor };
