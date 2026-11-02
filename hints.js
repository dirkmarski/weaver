// Hints: which technique to teach, the hint for a grid, the hint texts, and the cells, key line and links a hint marks.
import { cellName, UNIT_NAMES, UNITS, CELL_UNITS, toFlat } from './board.js';
import { findConflicts, verify, namedClash } from './checking.js';
import { boxName, andList, struckCells, aDigit } from './texts.js';
import { findNakedSingle, findHiddenSingle, findPointing, findClaiming } from './techniques.js';

// Which technique Hint should teach next: the one applied less so far (own and
// hint counts together). On a tie: 'naked' on easy, 'hidden' on the other levels.
function preferredTechnique(tally, level) {
  var n = tally.naked.own + tally.naked.hint, h = tally.hidden.own + tally.hidden.hint;
  if (h < n) return 'hidden';
  if (n < h) return 'naked';
  return level === 'easy' ? 'naked' : 'hidden';
}

// "the top‑left box, the digit D fits only in row L" for a pointing step.
function pointingClause(s) {
  return boxName(s.box) + ', the digit ' + s.pointDigit + ' fits only in ' + s.line + ' ' + (s.index + 1);
}

// Why the other cells of a hidden unit are out: every other empty cell of the unit (not the target, not struck) is
// assigned to the first of its row, column, box (not the unit's own kind) that holds D; the units are listed boxes,
// rows, columns. s = { r, c, unit, pointDigit, removed }. Returns "<units> already has/have a D", or '' when no cell
// is left to explain (shared by Hint step 3 and the own reward).
function holdersPhrase(s, grid) {
  var d = s.pointDigit, flat = toFlat(grid), kU = UNIT_NAMES.indexOf(s.unit), p = s.r * 9 + s.c;
  var holders = [[], [], []]; // rows, columns, boxes (numbers from 1; box index from 0)
  UNITS[CELL_UNITS[p][kU]].forEach(function (q) {
    if (q === p || flat[q] !== 0 || s.removed.indexOf(q) >= 0) return;
    for (var k = 0; k < 3; k++) {
      var u = CELL_UNITS[q][k];
      if (k !== kU && UNITS[u].some(function (x) { return flat[x] === d; })) { if (holders[k].indexOf(u) < 0) holders[k].push(u); break; }
    }
  });
  var named = [], count = holders[0].length + holders[1].length + holders[2].length;
  if (count === 0) return '';
  var boxes = holders[2].map(function (u) { return (u - 2) / 3; }).sort(function (a, b) { return a - b; });
  if (boxes.length === 1) named.push(boxName(boxes[0]));
  else if (boxes.length) named.push('the ' + andList(boxes.map(function (b) { return boxName(b).slice(4, -4); })) + ' boxes');
  [[0, 'row'], [1, 'column']].forEach(function (g) {
    var n = holders[g[0]].map(function (u) { return (u - g[0]) / 3 + 1; }).sort(function (a, b) { return a - b; });
    if (n.length) named.push(g[1] + (n.length > 1 ? 's ' : ' ') + andList(n));
  });
  return named.join(' and ') + (count === 1 ? ' already has ' : ' already have ') + aDigit(d);
}

// Step 3 of the hidden form of pointing and claiming: why the other cells of the hidden unit are out. Struck cells
// of the unit are counted; the rest are explained by holdersPhrase.
function hiddenStep3(s, grid) {
  var d = s.pointDigit, kU = UNIT_NAMES.indexOf(s.unit), p = s.r * 9 + s.c;
  var cells = UNITS[CELL_UNITS[p][kU]], unitName = s.unit === 'box' ? boxName((CELL_UNITS[p][2] - 2) / 3) : s.unit + ' ' + ((s.unit === 'row' ? s.r : s.c) + 1);
  var struck = cells.filter(function (q) { return s.removed.indexOf(q) >= 0; }).length;
  var why = holdersPhrase(s, grid);
  var tail = ' So ' + d + ' must go in ' + cellName(p) + '.', head = '3. In ' + unitName + ', step 2 crossed out ';
  if (!why) return head + (struck === 1 ? 'the other empty cell' : 'every other empty cell') + '.' + tail;
  var words = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
  return head + words[struck] + ' cell' + (struck === 1 ? '' : 's') + '; ' + why + '.' + tail;
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
      : hiddenStep3(s, grid);
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
      : hiddenStep3(s, grid);
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


// The cells a showing hint marks, as flat indices, for a hintFor result of kind nudge/explain:
// { area: the tinted cells (not the target), target,
//   digits: the ringed cells (ascending), on explain only,
//   hatched: the reason cells (ascending), on explain only,
//   confined, removed: a pointing explain's box cells where the digit fits and line cells that lose it (else empty) }.
// Tint: a naked single's row, column and box; a hidden single's unit; a pointing or claiming step's box and line, plus its hidden-form unit.
// Claiming: confined = the line cells where D fits, removed = the box cells that lose it, and the first reason set is the
// empty cells of the line that are not confined (pointing: of the box).
// Reason cells (none for a naked single): a hidden single's are the other empty cells of its unit; a pointing step's are the
// empty box cells that are not confined and, in the hidden form, the empty cells of the hidden unit other than the target
// and the removed cells. They are hatched on the page.
// Ringed digits, for D = the hidden single's digit or the pointing digit: a cell holding D that shares a row, column or box
// with a reason cell (an empty cell that D helps to rule out).
function hintMarks(hint, grid) {
  var p = hint.r * 9 + hint.c, units, claiming = hint.technique === 'claiming', pointing = claiming || hint.technique === 'pointing';
  var hidden = hint.unit ? [CELL_UNITS[p][UNIT_NAMES.indexOf(hint.unit)]] : [];
  var lineUnit = hint.index * 3 + (hint.line === 'row' ? 0 : 1);
  if (pointing) units = [hint.box * 3 + 2, lineUnit].concat(hidden);
  else units = hint.technique === 'hidden' ? hidden : CELL_UNITS[p];
  var area = [], digits = [], d = pointing ? hint.pointDigit : hint.technique === 'hidden' ? hint.digit : 0;
  units.forEach(function (u) { UNITS[u].forEach(function (q) { if (q !== p && area.indexOf(q) < 0) area.push(q); }); });
  var explain = pointing && hint.kind === 'explain';
  var reasons = [];
  function addReasons(cells, skip) {
    cells.forEach(function (x) { if (x !== p && grid[Math.floor(x / 9)][x % 9] === 0 && skip.indexOf(x) < 0) reasons.push(x); });
  }
  if (d && hint.kind === 'explain') {
    if (pointing) {
      addReasons(UNITS[claiming ? lineUnit : hint.box * 3 + 2], hint.confined);
      addReasons(hidden.length ? UNITS[hidden[0]] : [], hint.removed);
    } else addReasons(UNITS[hidden[0]], []);
    for (var q = 0; q < 81; q++) {
      if (grid[Math.floor(q / 9)][q % 9] !== d) continue;
      var mine = CELL_UNITS[q];
      if (reasons.some(function (x) { return CELL_UNITS[x].some(function (u) { return mine.indexOf(u) >= 0; }); })) digits.push(q);
    }
  }
  reasons.sort(function (a, b) { return a - b; });
  return {
    area: area, target: p, digits: digits, hatched: reasons,
    confined: explain ? hint.confined : [], removed: explain ? hint.removed : []
  };
}

// The key line under a hidden single's or pointing step's explanation; hatchedCount the hatched cells showing.
// Pointing names its dashed and struck marks, and the hatching only when a cell is hatched; a hidden single always has some.
// For a pointing step, `stage` (1-3, default 3) is the number of revealed steps: 1 names only the dashed marks, 2 adds the struck.
function hintKey(hint, hatchedCount, stage) {
  var pointing = hint.technique === 'pointing' || hint.technique === 'claiming', d = pointing ? hint.pointDigit : hint.digit;
  stage = stage || 3;
  var hatch = 'hatched = a purple ring rules ' + d + ' out there (' + aDigit(d) + ' already in the same row, column or box)';
  if (!pointing) return 'Key: ' + hatch + '.';
  return 'Key: dashed purple = the only places for ' + d + ' in the ' + (hint.technique === 'claiming' ? hint.line : 'box')
    + (stage > 1 ? '; struck grey ' + d + ' = this step rules ' + d + ' out there' : '')
    + (stage > 2 && hatchedCount ? '; ' + hatch : '') + '.';
}

// The link for a hatched cell p (flat index): { partners, text }. Partners are the ringed cells (`ringed`, ascending flat
// indices, hintMarks' digits) that share a row, column or box with p; text names, for the hint's digit d, each partner and the
// units (row, column, box, in that order) it shares with p.
function ringLink(p, ringed, d) {
  var partners = ringed.filter(function (q) { return sharedUnits(p, q).length > 0; });
  var parts = partners.map(function (q) {
    return 'the ' + d + ' at ' + cellName(q) + ' is in the same ' + sharedUnits(p, q).join(' and ');
  });
  var text = 'Hatched cell ' + cellName(p) + ': no ' + d + ' here, because ' + parts.join(', and ') + '.';
  return { partners: partners, text: text };
}

// The reverse of ringLink, for the ring q holding d: { cells, text }. Cells are the hatched cells (`hatched`, ascending flat
// indices) that share a row, column or box with q, and text names each with the units it shares (row, column, box).
function ringRules(q, hatched, d) {
  var cells = hatched.filter(function (p) { return sharedUnits(p, q).length > 0; });
  var items = cells.map(function (p) { return cellName(p) + ' (same ' + sharedUnits(p, q).join(' and ') + ')'; });
  var last = items.length > 1 ? ' and ' + items.pop() : '';
  var count = items.length + (last ? 1 : 0);
  var text = 'The ' + d + ' at ' + cellName(q) + ' rules ' + d + ' out of ' + (['', 'one', 'two', 'three', 'four'][count] || count)
    + ' hatched cell' + (count > 1 ? 's' : '') + ': ' + items.join(', ') + last + '.';
  return { cells: cells, text: text };
}
function sharedUnits(p, q) { return UNIT_NAMES.filter(function (n, k) { return CELL_UNITS[q][k] === CELL_UNITS[p][k]; }); }

export { holdersPhrase, hiddenStep3, preferredTechnique, hintFor, hintApplied, hintMarks, hintKey, ringLink, ringRules };
