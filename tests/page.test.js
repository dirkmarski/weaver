'use strict';
// Page tests: drive the real index.html in one headless Chrome (see tests/chrome.js) and read the DOM back.
// Skipped, with a reason, when Chrome is not found (CHROME_PATH) or WEAVER_NO_CHROME=1.
const { describe, it: base, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const S = require('../sudoku.js');
const { findChrome, launch } = require('./chrome.js');

const ROOT = path.join(__dirname, '..');
const found = findChrome(process.env);

// mulberry32 taken from the product source, so the page's Math.random is exactly seededRng(n).
function seedScript() {
  const m = fs.readFileSync(path.join(ROOT, 'sudoku.js'), 'utf8').match(/function seededRng\([\s\S]*?\n  \}/);
  if (!m) throw new Error('tests/page.test.js: seededRng not found in sudoku.js (its layout changed); update the extraction');
  return '(function () { ' + m[0] + '; window.__seed = function (n) { Math.random = seededRng(n); }; window.__seed(1); })();';
}

let page;
before(async () => {
  if (found.skip) return;
  page = await launch(found.path);
  await page.send('Emulation.setFocusEmulationEnabled', { enabled: true }); // headless Chrome fires no focus events otherwise
  await page.send('Page.addScriptToEvaluateOnNewDocument', { source: seedScript() });
});
after(() => page && page.close());

const J = JSON.stringify;
const game = (level, seed) => S.generatePuzzle(level, { rng: S.seededRng(seed) });
// First seed (from 1) whose puzzle satisfies pred(puzzle, solution).
function pick(level, pred) {
  for (let seed = 1; seed < 200; seed++) {
    const g = game(level, seed);
    const extra = pred(g.puzzle, g.solution);
    if (extra) return { seed, g, extra };
  }
  throw new Error('no ' + level + ' seed fits');
}
const empties = (puzzle) => puzzle.flatMap((row, r) => row.map((v, c) => (v ? -1 : r * 9 + c))).filter((p) => p >= 0);

// Fresh page, seeded, level chosen with a real click.
async function open(level, seed) {
  await page.eval('window.__stale = true');
  const nav = await page.send('Page.navigate', { url: pathToFileURL(path.join(ROOT, 'index.html')).href });
  if (nav.errorText) throw new Error('page did not load: ' + nav.errorText);
  let loaded = false;
  for (let i = 0; i < 200 && !loaded; i++) {
    loaded = await page.eval('!window.__stale && !!window.Sudoku');
    if (!loaded) await new Promise((r) => setTimeout(r, 10));
  }
  if (!loaded) throw new Error('page did not load');
  await page.eval('window.__seed(' + seed + ')');
  if (level) await click('[data-level=' + level + ']');
}
const click = (sel) => page.eval('document.querySelector(' + J(sel) + ').click()');
// Keydown on the cell input (the page's own key handler): list of [pos, key].
const keys = (list) => page.eval('(' + J(list) + ').forEach(function (k) { document.querySelector("input[data-pos=\\"" + k[0] + "\\"]")' +
  '.dispatchEvent(new KeyboardEvent("keydown", { key: k[1], bubbles: true, cancelable: true })); })');
const read = () => page.eval(`(function () {
  var tds = [].slice.call(document.querySelectorAll('#sudoku td')), st = document.getElementById('status');
  function at(c) { return tds.map(function (t, i) { return t.classList.contains(c) ? i : -1; }).filter(function (i) { return i >= 0; }); }
  var a = document.activeElement;
  return { status: st.textContent, key: document.getElementById('key').textContent, link: document.getElementById('link').textContent, cls: st.className, picker: !document.getElementById('picker').hidden, game: !document.getElementById('game').hidden,
    tallyShown: !document.getElementById('tally').hidden, level: document.getElementById('level-text').textContent,
    tally: ['tally-naked', 'tally-hidden', 'tally-pointing'].map(function (id) { return document.getElementById(id).textContent; }),
    notes: document.getElementById('notes').textContent, pressed: document.getElementById('notes').getAttribute('aria-pressed'),
    clash: at('clash'), target: at('hint-target'), area: at('hint-area'), hatched: at('hint-hatched'), digit: at('hint-digit'), linked: at('hint-linked'), ruled: at('hint-ruled'), confined: at('hint-confined'), removed: at('hint-removed'),
    dattr: tds.map(function (t, i) { return t.hasAttribute('data-d') ? i : -1; }).filter(function (i) { return i >= 0; }),
    dvals: tds.filter(function (t) { return t.hasAttribute('data-d'); }).map(function (t) { return t.getAttribute('data-d'); }),
    conflict: tds.map(function (t, i) { return t.querySelector('input.conflict') ? i : -1; }).filter(function (i) { return i >= 0; }),
    givenConflict: document.querySelectorAll('.given.conflict').length,
    given: tds.map(function (t) { return t.classList.contains('given') ? +t.textContent : 0; }),
    active: a && a.dataset ? a.dataset.pos : null };
})()`);
// The Next step button: label, or null while it is hidden (the button sits in #next, under #status).
const nextStep = () => page.eval('(function () { var p = document.getElementById("next"), b = document.getElementById("next-step"); return p.hidden ? null : b.textContent + "|" + b.tagName; })()');
const focusAt = (p) => page.eval('document.querySelector(\'input[data-pos="' + p + '"]\').focus()');
const noHint = (s) => { assert.deepStrictEqual([s.key, s.link], ['', '']); ['linked', 'ruled', 'target', 'area', 'hatched', 'digit', 'confined', 'removed', 'dattr'].forEach((k) => assert.deepStrictEqual(s[k], [], k)); };
const INVITE = 'Click or tap a hatched cell to see what rules it out (solid purple), or a ring to see which cells it rules out.';
const TALLY0 = ['Naked single: 0 on your own, 0 with a hint', 'Hidden single: 0 on your own, 0 with a hint', 'Pointing: 0 on your own, 0 with a hint'];

describe('page (headless Chrome)', () => {
  const it = (name, fn) => base(name, { skip: found.skip || false }, fn); // each test shows as skipped, with the reason
  // A digit that a given in its row already holds: seed, cell, digit, and the given's position.
  const clashing = pick('tricky', (p, sol) => {
    for (const pos of empties(p)) {
      const r = Math.floor(pos / 9), c = pos % 9;
      if (!p[r].slice(0, c).includes(0)) continue; // not the first input of its row
      for (let k = 0; k < 9; k++) {
        if (!p[r][k] || p[r][k] === sol[r][c]) continue;
        const grid = p.map((row) => row.slice());
        grid[r][c] = p[r][k];
        if (S.clashCells(grid).length === 2) return { pos, digit: p[r][k], given: r * 9 + k }; // exactly this pair clashes
      }
    }
    return null;
  });

  // The singles played on the page, so that the next hint is a pointing step (optionally one whose hatched count satisfies `ok`).
  const pointingState = (ok) => pick('tricky', (p, sol) => {
    const grid = p.map((row) => row.slice()), typed = [];
    for (let s; (s = S.findNakedSingle(grid) || S.findHiddenSingle(grid)); ) {
      grid[s.r][s.c] = sol[s.r][s.c];
      typed.push([s.r * 9 + s.c, String(sol[s.r][s.c])]);
    }
    const step = S.findPointing(grid);
    return step && ok(S.hintMarks(S.hintFor(grid, 2), grid).hatched.length) ? { typed, grid, step } : null;
  });
  const pointing = pointingState(() => true);
  const noRings = pointingState((n) => n === 0);

  it('seeding: the page Tricky puzzle for a seed equals generatePuzzle with seededRng', async () => {
    await open('tricky', 5);
    const flat = (await read()).given;
    assert.deepStrictEqual(flat, game('tricky', 5).puzzle.flat());
  });

  it('a. choosing a level shows the grid and a zero tally; New puzzle returns to the picker', async () => {
    await open(null, 5);
    let s = await read();
    assert.deepStrictEqual([s.picker, s.game, s.tallyShown], [true, false, false]);
    await click('[data-level=tricky]');
    s = await read();
    assert.deepStrictEqual([s.picker, s.game, s.tallyShown, s.level, s.tally], [false, true, true, 'Difficulty: Tricky', TALLY0]);
    await click('#hint');
    await click('#new-puzzle');
    s = await read();
    assert.deepStrictEqual([s.picker, s.game, s.tallyShown, s.status, s.cls, s.clash], [true, false, false, '', '', []]);
    noHint(s);
    const { seed, extra } = clashing;
    await open('tricky', seed);
    await keys([[extra.pos, String(extra.digit)]]);
    assert.strictEqual((await read()).clash.length, 2);
    await click('#new-puzzle');
    await click('[data-level=tricky]');
    assert.deepStrictEqual((await read()).clash, []);
  });

  it('b. an own naked single is green and the tally goes up by 1', async () => {
    const { seed, extra } = pick('tricky', (p) => S.findNakedSingle(p));
    await open('tricky', seed);
    await keys([[extra.r * 9 + extra.c, String(extra.digit)]]);
    const s = await read();
    assert.match(s.status, /^Well spotted!/);
    assert.strictEqual(s.cls, 'ok');
    assert.deepStrictEqual(s.tally, ['Naked single: 1 on your own, 0 with a hint', TALLY0[1], TALLY0[2]]);
  });

  it('b. an own hidden single is green and the tally goes up by 1', async () => {
    const { seed, extra } = pick('medium', (p) => S.findHiddenSingle(p, { notNaked: true }));
    await open('medium', seed);
    await keys([[extra.r * 9 + extra.c, String(extra.digit)]]);
    const s = await read();
    assert.match(s.status, /^Well spotted!/);
    assert.strictEqual(s.cls, 'ok');
    assert.deepStrictEqual(s.tally, [TALLY0[0], 'Hidden single: 1 on your own, 0 with a hint', TALLY0[2]]);
  });

  it('c/d. a clash is outlined, Verify marks only the own cell, Hint clears the red, clearing the slip clears the outline', async () => {
    const { pos, digit, given } = clashing.extra;
    await open('tricky', clashing.seed);
    await keys([[pos, String(digit)]]);
    let s = await read();
    assert.match(s.status, /^Entered: .*not counted/);
    assert.strictEqual(s.cls, '');
    assert.deepStrictEqual(s.clash, [given, pos].sort((x, y) => x - y));
    assert.deepStrictEqual(s.tally, TALLY0);
    await click('#verify');
    s = await read();
    assert.deepStrictEqual([s.conflict, s.givenConflict, s.cls], [[pos], 0, 'fail']);
    assert.deepStrictEqual(s.clash, [given, pos].sort((x, y) => x - y));
    await click('#hint');
    s = await read();
    assert.deepStrictEqual([s.conflict, s.clash.length], [[], 2]);
    noHint(s);
    await keys([[pos, 'Backspace']]);
    s = await read();
    assert.deepStrictEqual(s.clash, []);
    assert.strictEqual(s.status, 'No numbers break the rules now. New entries are counted again.');
    assert.strictEqual(s.cls, '');
  });

  it('e. a fix that fills the last cell shows "Puzzle solved!", not the fixed message', async () => {
    const { puzzle, solution } = game('tricky', 5);
    const [y, ...rest] = empties(puzzle);
    const r = Math.floor(y / 9), c = y % 9;
    await open('tricky', 5);
    await keys(rest.map((p) => [p, String(solution[Math.floor(p / 9)][p % 9])]));
    await keys([[y, String(solution[r][(c + 1) % 9])]]); // wrong digit: fills the grid with a clash
    let s = await read();
    assert.strictEqual(s.status, 'Every cell is filled, but some numbers break the rules. Click Verify to see which.');
    assert.strictEqual(s.cls, 'fail');
    await keys([[y, String(solution[r][c])]]); // overwrite with the right digit
    s = await read();
    assert.match(s.status, /^Puzzle solved! Techniques applied: \d+ on your own, \d+ with a hint\.$/);
    assert.strictEqual(s.cls, 'ok');
    assert.deepStrictEqual(s.clash, []);
  });

  it('f. a pointing hint shows its marks on both clicks; notes keep them, a value change removes them', async () => {
    const { seed, g, extra } = pointing;
    const { typed, grid, step } = extra;
    const target = step.r * 9 + step.c;
    await open('tricky', seed);
    await keys(typed);
    await click('#hint');
    let s = await read();
    assert.deepStrictEqual(s.target, [target]);
    assert.ok(s.area.length > 0 && !s.area.includes(target));
    assert.deepStrictEqual([s.confined, s.removed, s.dattr, s.key], [[], [], [], '']);
    await click('#hint');
    s = await read();
    const marks = S.hintMarks(S.hintFor(grid, 2), grid);
    assert.deepStrictEqual([s.target, s.confined, s.removed], [[target], step.confined, step.removed]);
    assert.deepStrictEqual([s.digit, s.hatched], [marks.digits, marks.hatched]);
    assert.strictEqual(s.key, S.hintKey(S.hintFor(grid, 2), marks.hatched.length)); // the key line (kept by the notes change below)
    assert.deepStrictEqual(s.dattr, step.confined.concat(step.removed).sort((x, y) => x - y));
    assert.ok(s.dvals.every((d) => d === String(step.pointDigit)));
    const other = empties(g.puzzle).filter((p) => !typed.some((t) => t[0] === p) && p !== target)[0];
    const before = { ...s, status: undefined };
    await keys([[target, 'N'], [other, '3']]); // Notes on, then a note: keeps the hint
    s = await read();
    assert.strictEqual(s.notes, 'Notes: On');
    assert.deepStrictEqual({ ...s, status: undefined, notes: before.notes, pressed: before.pressed }, before);
    await keys([[target, 'N'], [other, String(g.solution[Math.floor(other / 9)][other % 9])]]); // a value: removes it
    s = await read();
    noHint(s);
  });

  it('f1. Tricky prefers a useful pointing step: seed 1 first click nudges pointing, the hinted digit is rewarded and counted', async () => {
    await open('tricky', 1);
    await click('#hint');
    const style = '(function (cs) { return cs.whiteSpace + "|" + cs.textAlign; })(getComputedStyle(document.getElementById("status")))';
    assert.strictEqual(await page.eval(style), 'normal|center'); // the nudge keeps the plain style
    let s = await read();
    assert.deepStrictEqual([s.target, s.status.startsWith('Hint: try pointing. In the box of rows 1-3 and columns 7-9, the digit 2 fits only in row 1')], [[4], true]);
    await click('#hint');
    s = await read();
    assert.strictEqual(s.status, 'Pointing: row 1, column 5 must be 7.\n1. In the box of rows 1-3 and columns 7-9, the digit 2 fits only in row 1.');
    assert.strictEqual(await nextStep(), 'Next step (2 of 3)|BUTTON');
    await page.eval('document.getElementById("next-step").focus()');
    await click('#next-step');
    s = await read();
    assert.strictEqual(s.status, 'Pointing: row 1, column 5 must be 7.\n1. In the box of rows 1-3 and columns 7-9, the digit 2 fits only in row 1.\n'
      + '2. So 2 cannot go in row 1 outside that box: not in row 1, column 5.');
    assert.deepStrictEqual([await nextStep(), await page.eval('document.activeElement.id')], ['Next step (3 of 3)|BUTTON', 'next-step']); // focus stays on the button
    await click('#next-step');
    s = await read();
    assert.strictEqual(await nextStep(), null);
    assert.strictEqual(s.active, '4'); // the last step hands focus back to the target cell
    assert.strictEqual(s.status, 'Pointing: row 1, column 5 must be 7.\n1. In the box of rows 1-3 and columns 7-9, the digit 2 fits only in row 1.\n'
      + '2. So 2 cannot go in row 1 outside that box: not in row 1, column 5.\n'
      + '3. Row 1, column 5 has every digit except 2 and 7 in its row, column and box, so it could only take 2 or 7. With 2 ruled out, it must be 7.');
    assert.strictEqual(await page.eval(style), 'pre-line|left'); // one line per step, left-aligned
    await keys([[4, '7']]);
    s = await read();
    assert.strictEqual(s.status, 'Well done! You applied pointing: row 1, column 5 is 7.');
    assert.strictEqual(s.tally[2], 'Pointing: 0 on your own, 1 with a hint');
  });

  it('f1a. Hint advances the steps like Next step (hidden form, seed 8); a value change clears the button; at 360x740 the whole text fits', async () => {
    await open('tricky', 8);
    try {
      await page.send('Emulation.setDeviceMetricsOverride', { width: 360, height: 740, deviceScaleFactor: 1, mobile: true });
      await click('#hint');
      await click('#hint');
      const fits = (id) => page.eval('document.getElementById("' + id + '").getBoundingClientRect().bottom');
      const tops = () => page.eval('["sudoku", "link", "buttons"].map(function (id) { return document.getElementById(id).getBoundingClientRect().top; })');
      const still = await tops();
      assert.strictEqual((await read()).status.split('\n').length, 2);
      assert.strictEqual(await nextStep(), 'Next step (2 of 3)|BUTTON');
      assert.ok(await fits('next-step') <= 740, 'Next step button below the fold');
      assert.strictEqual(await page.eval('new Set(["next-step", "verify"].map(function (id) { var c = getComputedStyle(document.getElementById(id)); return c.font + c.padding; })).size'), 1); // same look as Verify
      await page.eval('document.getElementById("verify").focus()');
      await click('#hint');
      assert.ok(await page.eval('document.activeElement === document.querySelectorAll("#sudoku td")[27].querySelector("input")'), 'Hint focuses the target cell'); // r4c1
      assert.deepStrictEqual(await tops(), still); // grid, link line and button row do not move
      assert.strictEqual((await read()).status.split('\n').length, 3);
      assert.strictEqual(await nextStep(), 'Next step (3 of 3)|BUTTON');
      await click('#hint');
      const s = await read();
      assert.strictEqual(s.status.split('\n')[3], '3. That leaves row 4, column 1 as the only cell in its row where 8 fits, so it must be 8.');
      assert.strictEqual(await nextStep(), null);
      assert.ok(await fits('status') <= 740, '#status bottom below the fold');
      await click('#hint'); // once complete, a further click leaves the explanation as it is
      assert.deepStrictEqual([(await read()).status, await nextStep()], [s.status, null]);
    } finally {
      await page.send('Emulation.clearDeviceMetricsOverride');
    }
    await open('tricky', 8);
    await click('#hint');
    await click('#hint');
    await keys([[empties(game('tricky', 8).puzzle).find((q) => q !== 27), '5']]); // a value change removes the hint, its hidden steps and the button
    assert.deepStrictEqual([(await read()).status.startsWith('Entered: '), await nextStep()], [true, null]);
    await click('#hint');
    assert.ok((await read()).status.startsWith('Hint: try pointing'));
  });

  it('f1b. pins on the page: P1 pointing (hatched cells, key line, stripe and tint layers) and P3 hidden single (hatched, key line, a value change clears both)', async () => {
    const all = (...rc) => rc.map(([r, c]) => (r - 1) * 9 + c - 1);
    await open('tricky', 8);
    await click('#hint');
    await click('#hint');
    await click('#hint');
    await click('#hint');
    let s = await read();
    assert.strictEqual(s.status, 'Pointing: row 4, column 1 must be 8.\n1. In the box of rows 1-3 and columns 1-3, the digit 8 fits only in column 3.\n'
      + '2. So 8 cannot go in column 3 outside that box.\n3. That leaves row 4, column 1 as the only cell in its row where 8 fits, so it must be 8.');
    assert.deepStrictEqual(s.hatched, all([1, 3], [2, 2], [4, 8], [4, 9]));
    assert.strictEqual(s.key, 'Key: dashed purple = the only places for 8 in the box; struck grey 8 = this step rules 8 out there; hatched = a purple ring rules 8 out there (an 8 already in the same row, column or box).');
    const bg = await page.eval('getComputedStyle(document.querySelectorAll("#sudoku td")[2]).backgroundImage'); // r1c3, hatched
    assert.ok(bg.includes('repeating-linear-gradient(135deg, rgba(106, 31, 181, 0.25)') && bg.includes('linear-gradient(rgba(255, 179, 0, 0.3), rgba(255, 179, 0, 0.3))'), bg);
    await open('medium', 4);
    await click('#hint');
    await click('#hint');
    s = await read();
    assert.deepStrictEqual(s.hatched, all([1, 7], [1, 8], [1, 9], [2, 9], [3, 8]));
    assert.strictEqual(s.key, 'Key: hatched = a purple ring rules 4 out there (a 4 already in the same row, column or box).');
    await keys([[all([2, 8])[0], '1']]); // a value: removes the hatching and the key line
    noHint(await read());
  });

  it('f1c. L1 (Medium seed 1): focusing a hatched cell links its rings and names them; the target and a value change undo it; a linked given and entered value are white on purple', async () => {
    const pos = (r, c) => (r - 1) * 9 + c - 1;
    const focus = (r, c) => page.eval('document.querySelector("input[data-pos=\\"' + pos(r, c) + '\\"]").focus()');
    await open('medium', 1);
    await click('#hint');
    assert.strictEqual((await read()).link, ''); // the nudge
    await click('#hint');
    let s = await read();
    assert.deepStrictEqual([s.link, s.linked], [INVITE, []]);
    await focus(2, 3);
    s = await read();
    assert.deepStrictEqual(s.linked, [pos(2, 8), pos(9, 3)]);
    assert.strictEqual(s.link, 'Hatched cell row 2, column 3: no 5 here, because the 5 at row 2, column 8 is in the same row, and the 5 at row 9, column 3 is in the same column.');
    const look = await page.eval('(function () { var td = document.querySelectorAll("#sudoku td")[' + pos(2, 8) + ']; var cs = getComputedStyle(td);' +
      ' var e = document.querySelectorAll("#sudoku td")[' + pos(1, 2) + '], i = e.querySelector("input"); e.classList.add("hint-linked");' +
      ' return [td.classList.contains("given"), cs.backgroundColor, cs.color, getComputedStyle(i).color]; })()');
    assert.deepStrictEqual(look, [true, 'rgb(106, 31, 181)', 'rgb(255, 255, 255)', 'rgb(255, 255, 255)']);
    await focus(1, 2); // the target
    s = await read();
    assert.deepStrictEqual([s.link, s.linked], [INVITE, []]);
    await focus(2, 3);
    await page.eval('document.activeElement.blur()'); // focus leaves the grid
    s = await read();
    assert.deepStrictEqual([s.link, s.linked], [INVITE, []]);
    await focus(2, 3);
    await keys([[pos(1, 2), '5']]);
    noHint(await read());
  });

  it('f1d. pointing, naked form (Tricky seed 1): the link names the pointing digit 2, not the hinted digit 7', async () => {
    await open('tricky', 1);
    await click('#hint');
    await click('#hint');
    await page.eval('document.querySelector("input[data-pos=\\"15\\"]").focus()'); // row 2, column 7
    const s = await read();
    assert.deepStrictEqual(s.linked, [10, 78]); // row 2, column 2 and row 9, column 7
    assert.strictEqual(s.link, 'Hatched cell row 2, column 7: no 2 here, because the 2 at row 2, column 2 is in the same row, and the 2 at row 9, column 7 is in the same column.');
  });

  it('f1e. reverse link (Tricky seed 1, R3): click a ring, switch, hatched focus shows the forward link, target ends; outside click ends; re-click keeps', async () => {
    const pos = (r, c) => (r - 1) * 9 + c - 1;
    const tap = (r, c) => page.eval('document.querySelectorAll("#sudoku td")[' + pos(r, c) + '].click()');
    const state = async () => { const s = await read(); return [s.linked, s.ruled, s.link]; };
    const badges = () => page.eval('[].slice.call(document.querySelectorAll("#sudoku td")).map(function (t, i) { var s = getComputedStyle(t, "::after"); return s.color === "rgb(74, 15, 138)" && s.content === \'"2"\' ? i : -1; }).filter((i) => i >= 0)'); // the purple "2" badges
    await open('tricky', 1);
    await click('#hint');
    await click('#hint');
    assert.deepStrictEqual(await state(), [[], [], INVITE]); // the Hint click leaves nothing selected
    await tap(2, 2);
    assert.deepStrictEqual(await state(), [[pos(2, 2)], [pos(2, 7), pos(2, 8), pos(2, 9)],
      'The 2 at row 2, column 2 rules 2 out of three hatched cells: row 2, column 7 (same row), row 2, column 8 (same row) and row 2, column 9 (same row).']);
    assert.deepStrictEqual(await badges(), [pos(2, 7), pos(2, 8), pos(2, 9)]);
    await tap(9, 7);
    assert.deepStrictEqual(await state(), [[pos(9, 7)], [pos(2, 7), pos(3, 7)],
      'The 2 at row 9, column 7 rules 2 out of two hatched cells: row 2, column 7 (same column) and row 3, column 7 (same column).']);
    assert.deepStrictEqual(await badges(), [pos(2, 7), pos(3, 7)]);
    await tap(9, 7); // the selected ring again
    assert.deepStrictEqual((await state())[0], [pos(9, 7)]);
    await focusAt(pos(3, 7));
    assert.deepStrictEqual(await state(), [[pos(9, 7)], [],
      'Hatched cell row 3, column 7: no 2 here, because the 2 at row 9, column 7 is in the same column.']);
    assert.deepStrictEqual(await badges(), []);
    const s = await read(); // a hatched cell is never confined or removed, so no ruled badge meets a pointing badge; only their data-d is left
    assert.deepStrictEqual([s.hatched.filter((p) => s.confined.concat(s.removed).includes(p)), s.dattr], [[], s.confined.concat(s.removed).sort((x, y) => x - y)]);
    await page.eval('document.querySelector(\'input[data-pos="' + pos(3, 7) + '"]\').click()'); // the click that follows the focus
    assert.deepStrictEqual(await state(), [[pos(9, 7)], [],
      'Hatched cell row 3, column 7: no 2 here, because the 2 at row 9, column 7 is in the same column.']);
    await focusAt(pos(1, 5)); // the target
    assert.deepStrictEqual(await state(), [[], [], INVITE]);
    await tap(2, 2);
    await page.eval('document.body.click()'); // outside the grid
    assert.deepStrictEqual(await state(), [[], [], INVITE]);
    await tap(2, 2);
    await tap(1, 1); // a given that is no ring
    assert.deepStrictEqual(await state(), [[], [], INVITE]);
    await tap(2, 2);
    await click('#verify');
    noHint(await read()); // clearing leaves no data-d behind
    await page.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 1, mobile: true });
    try {
      const steps = [() => open('tricky', 1), () => click('#hint'), () => click('#hint'), () => tap(2, 2), () => focusAt(pos(3, 7)), () => focusAt(pos(1, 5))];
      const measure = () => page.eval('[["#sudoku","bottom"],["#link","top"],["#link","bottom"],["#hint","top"]].map(function (p) { return document.querySelector(p[0]).getBoundingClientRect()[p[1]]; })');
      const rows = []; // [grid bottom, link top, link bottom, button row top] after: no hint, nudge, invitation, R3, forward link, invitation
      for (const step of steps) rows.push(await step().then(measure));
      rows.forEach(([g, l, e, b], i) => assert.ok(g < l && e < b && b === rows[0][3], '375 px step ' + i + ' [grid bottom, link top, link bottom, buttons top]: ' + rows[i]));
      await click('#new-puzzle');
      await click('[data-level=easy]'); // a second level choice: the text and New puzzle must survive it
      assert.strictEqual((await read()).level, 'Difficulty: Easy');
      const [text, newp, grid, ver, hint, notes] = await page.eval('["#level-text", "#new-puzzle", "#sudoku", "#verify", "#hint", "#notes"].map(function (s) { var b = document.querySelector(s).getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom]; })'); // [left, top, right, bottom]
      assert.ok(newp[0] >= text[2] && newp[1] < text[3] && text[1] < newp[3] && newp[3] < grid[1] && newp[3] - newp[1] >= 28, 'New puzzle after the level text, on its line, above the grid: ' + [text, newp, grid]);
      assert.ok(grid[1] <= 88, 'compact top at 375 px: grid top <= 88 (main 106.8): ' + grid[1]);
      assert.ok(ver[1] === hint[1] && hint[1] === notes[1] && hint[0] - ver[2] >= 8 && notes[0] - hint[2] >= 8, 'Verify, Hint, Notes share a top, gaps >= 8: ' + [ver, hint, notes]);
      assert.ok([ver, hint, notes].every((b) => b[3] - b[1] >= 34), 'play buttons >= 34 px tall: ' + [ver, hint, notes]);
    } finally {
      await page.send('Emulation.clearDeviceMetricsOverride');
    }
  });

  it('f1f. an entered ring is selected by focus (Medium seed 1 played on with singles until a ring is a digit the player entered)', async () => {
    await open('medium', 1);
    const grid = game('medium', 1).puzzle.map((row) => row.slice()), sol = game('medium', 1).solution;
    let s;
    for (let i = 0; i < 40; i++) {
      await click('#hint');
      await click('#hint');
      s = await read();
      if (s.hatched.length && s.digit.some((p) => !s.given[p])) break;
      const step = S.findNakedSingle(grid) || S.findHiddenSingle(grid);
      grid[step.r][step.c] = sol[step.r][step.c];
      await keys([[step.r * 9 + step.c, String(sol[step.r][step.c])]]);
    }
    const ring = s.digit.find((p) => !s.given[p]);
    assert.ok(ring !== undefined, 'no entered ring found');
    await focusAt(ring);
    s = await read();
    const d = +(await page.eval('document.querySelector(\'input[data-pos="' + ring + '"]\').value'));
    assert.deepStrictEqual([s.linked, s.ruled, s.link], [[ring], S.ringRules(ring, s.hatched, d).cells, S.ringRules(ring, s.hatched, d).text]);
    assert.ok(s.ruled.length >= 1);
  });

  it('f2. the key line is gone after Verify; a hidden single is taught (its key line is pinned in f1b), a naked single none and nothing hatched', async () => {
    const { seed, extra } = pointing;
    await open('tricky', seed);
    await keys(extra.typed);
    await click('#hint');
    await click('#hint');
    await click('#verify');
    noHint(await read());
    const p = pick('tricky', (pz) => S.findHiddenSingle(pz) && !S.findPointing(pz, { useful: true })); // Tricky teaches a useful pointing step first
    await open('tricky', p.seed);
    await click('#hint');
    await click('#hint');
    let s = await read();
    assert.ok(s.status.startsWith('Hidden single'), s.status);
    assert.strictEqual(await nextStep(), null);
    const n = pick('easy', (pz) => S.findNakedSingle(pz));
    await open('easy', n.seed);
    await click('#hint');
    await click('#hint');
    s = await read();
    assert.ok(s.status.startsWith('Naked single'), s.status);
    assert.deepStrictEqual([s.key, s.hatched], ['', []]);
  });

  it('f2b. with no ring and no reason cell the key line has no hatched clause', async () => {
    const { seed, extra } = noRings;
    await open('tricky', seed);
    await keys(extra.typed);
    await click('#hint');
    await click('#hint');
    const s = await read();
    assert.deepStrictEqual(s.digit, []);
    assert.ok(s.key.endsWith('out there.') && !s.key.includes('hatched'));
  });

  it('f3. the badge sits in the note slot of its digit, for every digit 1-9 (1 top-left, 5 centre, 9 bottom-right)', async () => {
    await open('tricky', 5);
    // Probes the CSS rules themselves (no hook in the product): put a purple badge for D on one cell and compare its centre with the centre of the cell's own note slot D.
    const centres = await page.eval('(function () {' +
      'var td = document.querySelector("#sudoku td"), out = [];' +
      'td.classList.add("hint-confined");' +
      '[1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (d) {' +
      '  td.setAttribute("data-d", d);' +
      '  var box = td.getBoundingClientRect(), after = getComputedStyle(td, "::after"), slot = td.querySelectorAll(".notes span")[d - 1].getBoundingClientRect();' +
      '  out.push([parseFloat(after.left) + box.left + td.clientLeft - slot.left - slot.width / 2, parseFloat(after.top) + box.top + td.clientTop - slot.top - slot.height / 2, after.transform]);' +
      '});' +
      'return out; })()');
    centres.forEach(([dx, dy, transform], i) => {
      assert.ok(Math.abs(dx) < 1.5 && Math.abs(dy) < 1.5, 'slot ' + (i + 1) + ': centre off by ' + dx + ', ' + dy);
      assert.notStrictEqual(transform, 'none');
    });
  });

  it('f4. at 375 px (phone mode) the cells are square and the corner badges (1, 3, 7, 9) lie inside the cell, flush with their edges; the chip padding is 1px and the struck chip is legible; the viewport is restored', async () => {
    await open('tricky', 5);
    try {
      const probe = '(function () {' +
        'var tds = document.querySelectorAll("#sudoku td"), g = document.getElementById("sudoku").getBoundingClientRect(), out = { sq: 0, rows: [], grid: [g.left, g.right] };' +
        'tds.forEach(function (t) { var q = t.getBoundingClientRect(); out.sq = Math.max(out.sq, Math.abs(q.width - q.height)); });' +
        '[[tds[0], 1], [tds[2], 3], [tds[6], 7], [tds[8], 9]].forEach(function (p) {' +
        '  var td = p[0], d = p[1];' +
        '  td.classList.add("hint-confined"); td.setAttribute("data-d", d);' +
        '  var box = td.getBoundingClientRect(), a = getComputedStyle(td, "::after"), m = a.transform.match(/matrix\\(([^)]+)\\)/)[1].split(",").map(parseFloat);' +
        '  var pl = box.left + td.clientLeft, pr = box.right - (td.offsetWidth - td.clientLeft - td.clientWidth);' +
        '  var w = ["width", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"].reduce(function (n, k) { return n + parseFloat(a[k]); }, 0);' +
        '  var left = pl + parseFloat(a.left) + m[4];' +
        '  var pt = box.top + td.clientTop, pb = box.bottom - (td.offsetHeight - td.clientTop - td.clientHeight), top = pt + parseFloat(a.top) + m[5];' +
        '  var h = ["height", "paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"].reduce(function (n, k) { return n + parseFloat(a[k]); }, 0);' +
        '  out.rows.push({ d: d, inL: left - pl, inR: pr - (left + w), inT: top - pt, inB: pb - (top + h), pad: a.paddingLeft + " " + a.paddingRight });' +
        '});' +
        'return out; })()';
      let r;
      for (const w of [360, 375]) {
        await page.send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: true });
        for (let i = 0; i < 100; i++) { // wait for the new width to lay out
          r = await page.eval(probe);
          if (r.sq <= 1) break;
          await page.eval('document.querySelectorAll("#sudoku td").forEach(function (t) { t.classList.remove("hint-confined"); t.removeAttribute("data-d"); })');
          await new Promise((x) => setTimeout(x, 20));
        }
        assert.ok(r.sq <= 1, 'cells not square at ' + w + ' px: ' + r.sq);
      }
      assert.ok(Math.abs(r.grid[0] - 16) <= 1 && Math.abs(r.grid[1] - 359) <= 1, 'grid does not span the page padding at 375 px: ' + r.grid);
      r.rows.forEach((x) => {
        assert.strictEqual(x.pad, '1px 1px', 'badge ' + x.d + ' padding');
        assert.ok(Math.min(x.inL, x.inR, x.inT, x.inB) >= -0.5, 'badge ' + x.d + ' outside the cell: ' + [x.inL, x.inR, x.inT, x.inB]);
        // flush against its own edges (left rule for 1 and 7, right for 3 and 9, top for 1 and 3, bottom for 7 and 9), not merely inside the tolerance
        assert.ok(Math.abs(x.d % 3 === 1 ? x.inL : x.inR) < 0.25, 'badge ' + x.d + ' not flush sideways: ' + x.inL + ' / ' + x.inR);
        assert.ok(Math.abs(x.d < 4 ? x.inT : x.inB) < 0.25, 'badge ' + x.d + ' not flush top or bottom: ' + x.inT + ' / ' + x.inB);
      });
      const rows = await page.eval('(function () { var td = document.querySelectorAll("#sudoku td")[1], out = []; td.classList.add("hint-removed");' +
        'for (var d = 1; d <= 9; d++) { td.setAttribute("data-d", d); var a = getComputedStyle(td, "::after"); out.push([a.backgroundImage, parseFloat(a.width) + parseFloat(a.paddingLeft) + parseFloat(a.paddingRight), parseFloat(a.height) + parseFloat(a.paddingTop) + parseFloat(a.paddingBottom)]); } return out; })()');
      const [, rgb, from, to] = rows[0][0].match(/rgb\(255, 255, 255\) [\d.]+%, rgb\((\d+, \d+, \d+)\) ([\d.]+)%, rgb\([\d, ]+\) ([\d.]+)%/);
      const lin = rgb.split(', ').map((v) => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      assert.ok(1.05 / (0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2] + 0.05) >= 4.5, 'strike contrast: rgb(' + rgb + ')');
      const thin = Math.min(...rows.map(([, w, h]) => (to - from) / 100 * 2 * w * h / Math.hypot(w, h)));
      assert.ok(thin >= 2, 'strike thickness at 375 px, thinnest of the digits 1-9: ' + thin + ' px at stops ' + from + '-' + to);
    } finally {
      await page.send('Emulation.clearDeviceMetricsOverride');
    }
  });

  it('g. the N key and the Notes button toggle Notes; a digit with Notes on adds a note and no count', async () => {
    const { puzzle } = game('tricky', 5);
    const [p, q] = empties(puzzle);
    await open('tricky', 5);
    await keys([[p, 'N']]);
    let s = await read();
    assert.deepStrictEqual([s.notes, s.pressed], ['Notes: On', 'true']);
    await keys([[p, 'n']]);
    assert.strictEqual((await read()).notes, 'Notes: Off');
    await click('#notes');
    assert.strictEqual((await read()).notes, 'Notes: On');
    await keys([[q, '4']]);
    s = await read();
    assert.deepStrictEqual([s.tally, s.status, s.clash], [TALLY0, '', []]);
    const cell = await page.eval('(function () { var i = document.querySelector("input[data-pos=\\"' + q + '\\"]");' +
      'return { value: i.value, label: i.getAttribute("aria-label"), note: i.parentNode.querySelectorAll(".notes span")[3].textContent }; })()');
    assert.deepStrictEqual([cell.value, cell.note], ['', '4']);
    assert.match(cell.label, /, notes 4$/);
    await click('#notes');
    assert.strictEqual((await read()).notes, 'Notes: Off');
  });

  it('h. arrow keys move the focus past givens and change nothing else', async () => {
    const { puzzle } = game('tricky', 5);
    const dirs = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    let jump = null, edge = null;
    for (const p of empties(puzzle)) {
      for (const [k, d] of Object.entries(dirs)) {
        const n = S.nextCell(puzzle, Math.floor(p / 9), p % 9, d);
        if (!jump && n && Math.abs(n[0] * 9 + n[1] - p) > (d === 'left' || d === 'right' ? 1 : 9)) jump = { p, k, to: n[0] * 9 + n[1] };
        if (!edge && !n) edge = { p, k };
      }
    }
    assert.ok(jump && edge);
    await open('tricky', 5);
    for (const [m, expected] of [[jump, String(jump.to)], [edge, String(edge.p)]]) {
      await page.eval('document.querySelector("input[data-pos=\\"' + m.p + '\\"]").focus()');
      const before = await page.eval('document.body.innerHTML');
      await keys([[m.p, m.k]]);
      assert.strictEqual((await read()).active, expected);
      assert.strictEqual(await page.eval('document.body.innerHTML'), before);
    }
  });

  it('Verify with nothing wrong is green and counts the empty cells; letters and 0 are rejected', async () => {
    const { puzzle } = game('tricky', 5);
    const p = empties(puzzle)[0];
    await open('tricky', 5);
    await keys([[p, 'x'], [p, '0']]);
    let s = await read();
    assert.deepStrictEqual([s.status, s.clash], ['', []]);
    await click('#verify');
    s = await read();
    assert.strictEqual(s.status, 'No mistakes so far. ' + empties(puzzle).length + ' empty cells left.');
    assert.strictEqual(s.cls, 'ok');
  });
});
