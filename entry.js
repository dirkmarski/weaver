// Entry: digit text, key presses in a cell, pencil notes, moving between cells.

// Normalise raw text typed/pasted into a cell: '' or a single digit '1'-'9'.
// Anything else (letters, 0, multi-char strings) yields null (= reject).
function sanitizeDigit(text) {
  if (text === '') return '';
  return typeof text === 'string' && /^[1-9]$/.test(text) ? text : null;
}

// A cell is { value: '' | '1'-'9', notes: bitmask } where bit d is set when
// digit d is noted (bits 1-9).

function noteDigits(mask) {
  var out = [];
  for (var d = 1; d <= 9; d++) if (mask & (1 << d)) out.push(d);
  return out;
}

// Pure transition for one key press (or text entered) in a cell. `key` is a
// digit text, 'Backspace' or 'Delete'; anything else changes nothing.
//  - normal mode: a digit becomes the value and drops the notes; delete clears the value.
//  - notes mode: a digit toggles a note, but only in a cell with no value;
//    delete removes all notes of an empty cell (and clears the value otherwise).
function applyEntry(cell, key, notesMode) {
  if (key === 'Backspace' || key === 'Delete') {
    return { value: '', notes: cell.value || !notesMode ? cell.notes : 0 };
  }
  var d = sanitizeDigit(key);
  if (!d) return cell;
  if (!notesMode) return { value: d, notes: 0 };
  return cell.value ? cell : { value: '', notes: cell.notes ^ (1 << d) };
}

// Next editable (empty in the puzzle) cell from (r, c) in a direction
// ('up'|'down'|'left'|'right'), skipping givens, no wrapping.
// Returns [r, c], or null if there is none.
function nextCell(puzzle, r, c, direction) {
  var dr = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
  var dc = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
  if (!dr && !dc) return null;
  for (r += dr, c += dc; r >= 0 && r < 9 && c >= 0 && c < 9; r += dr, c += dc) {
    if (!puzzle[r][c]) return [r, c];
  }
  return null;
}

export { sanitizeDigit, noteDigits, applyEntry, nextCell };
