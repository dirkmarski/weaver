// Hints: which technique to teach, the hint for a grid, the hint texts.
import { UNITS } from './board.js';
import { findConflicts, verify } from './validation.js';
import { namedClash } from './clashes.js';
import { boxName, struckCells, aDigit } from './texts.js';
import { findNakedSingle, findHiddenSingle, findPointing, findClaiming } from './techniques.js';

// Which technique Hint should teach next: the one applied less so far (own and
// hint counts together). On a tie: 'naked' on easy, 'hidden' on the other levels.
function preferredTechnique(tally, level) {
  var n = tally.naked.own + tally.naked.hint, h = tally.hidden.own + tally.hidden.hint;
  if (h < n) return 'hidden';
  if (n < h) return 'naked';
  return level === 'easy' ? 'naked' : 'hidden';
}

// "the box of ..., the digit D fits only in row L" for a pointing step.
function pointingClause(s) {
  return boxName(s.box) + ', the digit ' + s.pointDigit + ' fits only in ' + s.line + ' ' + (s.index + 1);
}

// The hintFor result for a pointing step (see findPointing).
function pointingHint(s, step, grid) {
  var line = s.line + ' ' + (s.index + 1), d = s.pointDigit;
  var box = pointingClause(s);
  var unitName = s.form === 'naked' ? '' : s.unit === 'box'
    ? boxName(3 * Math.floor(s.r / 3) + Math.floor(s.c / 3))
    : s.unit + ' ' + ((s.unit === 'row' ? s.r : s.c) + 1);
  // The box has no empty cell outside the confined cells: the clause then says so (an explain only).
  var empties = UNITS[s.box * 3 + 2].filter(function (q) { return grid[Math.floor(q / 9)][q % 9] === 0; });
  if (step === 2 && empties.length === s.confined.length) box += ' (the box has no other empty cells)';
  var text;
  if (step === 2) {
    var rc = 'row ' + (s.r + 1) + ', column ' + (s.c + 1);
    text = 'Pointing: ' + rc + ' must be ' + s.digit + '.\n1. In ' + box + '.\n';
    text += '2. So ' + d + ' cannot go in ' + line + ' outside that box: not in ' + struckCells(s.removed) + ' (struck).\n';
    text += s.form === 'naked'
      ? '3. Row ' + (s.r + 1) + ', column ' + (s.c + 1) + ' has every digit except ' + d + ' and ' + s.digit + ' in its row, column and box, so it could only take ' + d + ' or ' + s.digit + '. With ' + d + ' ruled out, it must be ' + s.digit + '.'
      : '3. That leaves ' + rc + ' as the only cell in ' + unitName + ' where ' + d + ' fits, so it must be ' + d + '.';
  } else {
    var tail;
    if (s.form === 'naked') {
      tail = 'That means ' + d + ' cannot go in row ' + (s.r + 1) + ', column ' + (s.c + 1) + ', and only one other digit fits there now.';
    } else {
      tail = 'Then look at ' + unitName + ': ' + d + ' now has only one place left there.';
    }
    text = 'Hint: try pointing. In ' + box + ', so it cannot go anywhere else in ' + line + '. ' + tail + ' Click Hint again to see why.';
  }
  return { kind: step === 2 ? 'explain' : 'nudge', technique: 'pointing', form: s.form, unit: s.unit, box: s.box, line: s.line, index: s.index,
    pointDigit: d, confined: s.confined, removed: s.removed, r: s.r, c: s.c, digit: s.digit, text: text };
}

// The hintFor result for a claiming step (see findClaiming); same shape as pointingHint's.
function claimingHint(s, step, grid) {
  var line = s.line + ' ' + (s.index + 1), d = s.pointDigit, rc = 'row ' + (s.r + 1) + ', column ' + (s.c + 1);
  var box = boxName(s.box), text;
  if (step === 2) {
    // Every empty cell of the line is confined: line 1 says so.
    var empties = UNITS[s.index * 3 + (s.line === 'row' ? 0 : 1)].filter(function (q) { return grid[Math.floor(q / 9)][q % 9] === 0; });
    text = 'Claiming: ' + rc + ' must be ' + s.digit + '.\n1. In ' + line + ', the digit ' + d + ' fits only in ' + box
      + (empties.length === s.confined.length ? ' (the ' + s.line + ' has no other empty cells)' : '') + '.\n'
      + '2. So ' + d + ' cannot go anywhere else in that box: not in ' + struckCells(s.removed) + ' (struck).\n';
    text += s.form === 'naked'
      ? '3. ' + rc.charAt(0).toUpperCase() + rc.slice(1) + ' has every digit except ' + d + ' and ' + s.digit + ' in its row, column and box, so it could only take ' + d + ' or ' + s.digit + '. With ' + d + ' ruled out, it must be ' + s.digit + '.'
      : '3. That leaves ' + rc + ' as the only cell in ' + s.unit + ' ' + ((s.unit === 'row' ? s.r : s.c) + 1) + ' where ' + d + ' fits, so it must be ' + d + '.';
  } else {
    text = 'Hint: try claiming. In ' + line + ', the digit ' + d + ' fits only in ' + box + ', so it cannot go anywhere else in that box. ';
    text += s.form === 'naked'
      ? 'That means ' + d + ' cannot go in ' + rc + ', and only one other digit fits there now.'
      : 'Then look at ' + s.unit + ' ' + ((s.unit === 'row' ? s.r : s.c) + 1) + ': ' + d + ' now has only one place left there.';
    text += ' Click Hint again to see why.';
  }
  return { kind: step === 2 ? 'explain' : 'nudge', technique: 'claiming', form: s.form, unit: s.unit, box: s.box, line: s.line, index: s.index,
    pointDigit: d, confined: s.confined, removed: s.removed, r: s.r, c: s.c, digit: s.digit, text: text };
}

// What Hint says for a grid. step 1 = nudge, step 2 = explain (only used when
// a single or pointing step is found). A naked single is taught before a hidden single, unless
// prefer === 'hidden' and a hidden single that is not a naked single exists. With no single, a pointing step
// (findPointing), else a claiming step (findClaiming, same result shape, technique 'claiming'), is taught; on level 'tricky' a useful pointing step (findPointing with useful: true) comes
// before any single, and on 'tough' a useful claiming step (findClaiming with useful: true) comes before that; its result adds technique 'pointing', form, box, line, index, pointDigit. Returns
// { kind, technique, unit, r, c, digit, text } where kind is
// 'conflict' | 'full' | 'none' | 'nudge' | 'explain'. For the last two, r/c are
// 0-based, technique is 'naked' | 'hidden' | 'pointing' | 'claiming' and unit ('box' | 'row' | 'column') is set for hidden.
function hintFor(grid, step, prefer, level) {
  if (findConflicts(grid).length) {
    var clash = namedClash(grid);
    return { kind: 'conflict', text: clash.phrase.charAt(0).toUpperCase() + clash.phrase.slice(1)
      + '. Change or clear one of them first, then click Hint again.' + clash.extra };
  }
  if (verify(grid).complete) return { kind: 'full', text: 'Every cell is filled. Click Verify to check the grid.' };
  var s = level === 'tough' ? findClaiming(grid, { useful: true }) : null;
  if (s) return claimingHint(s, step, grid);
  s = level === 'tricky' || level === 'tough' ? findPointing(grid, { useful: true }) : null;
  if (s) return pointingHint(s, step, grid);
  s = prefer === 'hidden' ? findHiddenSingle(grid, { notNaked: true }) : null;
  var technique = 'hidden';
  if (!s) {
    s = findNakedSingle(grid);
    technique = 'naked';
  }
  if (!s) {
    s = findHiddenSingle(grid);
    technique = 'hidden';
  }
  if (!s) {
    s = findPointing(grid);
    if (s) return pointingHint(s, step, grid);
    s = findClaiming(grid);
    if (s) return claimingHint(s, step, grid);
    return { kind: 'none', text: 'No naked single, hidden single, pointing or claiming step right now. At this point the puzzle needs another technique.' };
  }
  var where = 'row ' + (s.r + 1) + ', column ' + (s.c + 1);
  var text;
  if (technique === 'naked') {
    if (step === 2) {
      text = 'Naked single: ' + where + ' must be ' + s.digit + ', because its row, column and box already contain '
        + s.seen.slice(0, -1).join(', ') + ' and ' + s.seen[7] + '.';
    } else {
      text = 'Hint: ' + where + ' is a naked single: only one digit fits there. Check its row, column and box to find it. '
        + 'Click Hint again to see why.';
    }
  } else if (step === 2) {
    var others = { box: 'row or column', row: 'column or box', column: 'row or box' }[s.unit];
    text = 'Hidden single: ' + where + ' must be ' + s.digit + ', because every other empty cell in its ' + s.unit
      + ' already has ' + aDigit(s.digit) + ' in its ' + others + '.';
  } else {
    text = 'Hint: ' + where + ' is a hidden single: in its ' + s.unit + ', one of the missing digits fits only in this cell. '
      + 'Check where each missing digit can go in the ' + s.unit + '. Click Hint again to see why.';
  }
  return { kind: step === 2 ? 'explain' : 'nudge', technique: technique, unit: s.unit, r: s.r, c: s.c, digit: s.digit, text: text };
}

// Reward text when `value` ('' or '1'-'9') entered in the hint's target cell
// applies the showing hint (a hintFor result of kind nudge/explain); '' otherwise.
function hintApplied(hint, value) {
  if (!hint || String(hint.digit) !== value) return '';
  if (hint.technique === 'pointing' || hint.technique === 'claiming') return 'Well done! You applied ' + hint.technique + ': row ' + (hint.r + 1) + ', column ' + (hint.c + 1) + ' is ' + value + '.';
  return 'Well done! You applied a ' + hint.technique + ' single: row ' + (hint.r + 1) + ', column ' + (hint.c + 1) + ' is ' + value + '.';
}

export { preferredTechnique, hintFor, hintApplied };
