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
  return { status: st.textContent, key: document.getElementById('key').textContent, cls: st.className, picker: !document.getElementById('picker').hidden, game: !document.getElementById('game').hidden,
    tallyShown: !document.getElementById('tally').hidden, level: document.getElementById('level').textContent,
    tally: ['tally-naked', 'tally-hidden', 'tally-pointing'].map(function (id) { return document.getElementById(id).textContent; }),
    notes: document.getElementById('notes').textContent, pressed: document.getElementById('notes').getAttribute('aria-pressed'),
    clash: at('clash'), target: at('hint-target'), area: at('hint-area'), digit: at('hint-digit'), confined: at('hint-confined'), removed: at('hint-removed'),
    dattr: tds.map(function (t, i) { return t.hasAttribute('data-d') ? i : -1; }).filter(function (i) { return i >= 0; }),
    dvals: tds.filter(function (t) { return t.hasAttribute('data-d'); }).map(function (t) { return t.getAttribute('data-d'); }),
    conflict: tds.map(function (t, i) { return t.querySelector('input.conflict') ? i : -1; }).filter(function (i) { return i >= 0; }),
    givenConflict: document.querySelectorAll('.given.conflict').length,
    given: tds.map(function (t) { return t.classList.contains('given') ? +t.textContent : 0; }),
    active: a && a.dataset ? a.dataset.pos : null };
})()`);
const noHint = (s) => { assert.strictEqual(s.key, ''); ['target', 'area', 'digit', 'confined', 'removed', 'dattr'].forEach((k) => assert.deepStrictEqual(s[k], [], k)); };
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

  // The singles played on the page, so that the next hint is a pointing step (optionally one whose ring count satisfies `ok`).
  const pointingState = (ok) => pick('tricky', (p, sol) => {
    const grid = p.map((row) => row.slice()), typed = [];
    for (let s; (s = S.findNakedSingle(grid) || S.findHiddenSingle(grid)); ) {
      grid[s.r][s.c] = sol[s.r][s.c];
      typed.push([s.r * 9 + s.c, String(sol[s.r][s.c])]);
    }
    const step = S.findPointing(grid);
    return step && ok(S.hintMarks(S.hintFor(grid, 2), grid).digits.length) ? { typed, grid, step } : null;
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
    assert.deepStrictEqual(s.digit, marks.digits);
    assert.strictEqual(s.key, S.pointingKey(step.pointDigit, marks.digits.length)); // the key line (kept by the notes change below)
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

  it('f2. the key line is gone after Verify; a naked/hidden explanation and the first click have none', async () => {
    const { seed, extra } = pointing;
    await open('tricky', seed);
    await keys(extra.typed);
    await click('#hint');
    await click('#hint');
    assert.match((await read()).key, /^Key: dashed purple = the only places for \d in the box; struck grey /);
    await click('#verify');
    noHint(await read());
    const p = pick('tricky', (pz) => S.findHiddenSingle(pz));
    await open('tricky', p.seed);
    await click('#hint');
    await click('#hint');
    const s = await read();
    assert.ok(s.status.startsWith('Hidden single') || s.status.startsWith('Naked single'));
    assert.deepStrictEqual([s.key, s.dattr], ['', []]);
  });

  it('f2b. with no ring the key line has no ring clause (and none is ringed)', async () => {
    const { seed, extra } = noRings;
    await open('tricky', seed);
    await keys(extra.typed);
    await click('#hint');
    await click('#hint');
    const s = await read();
    assert.deepStrictEqual(s.digit, []);
    assert.strictEqual(s.key, S.pointingKey(extra.step.pointDigit, 0));
    assert.ok(s.key.endsWith('go there.') && !s.key.includes('purple ring'));
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

  it('f4. at 375 px the edge badges (1 left, 9 right) lie inside the cell and the chip padding is 1px; the viewport is restored', async () => {
    await open('tricky', 5);
    await page.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 1, mobile: false });
    try {
      const probe = '(function () {' +
        'var tds = document.querySelectorAll("#sudoku td"), out = { cw: tds[0].clientWidth, rows: [] };' +
        '[[tds[0], 1], [tds[8], 9]].forEach(function (p) {' +
        '  var td = p[0], d = p[1];' +
        '  td.classList.add("hint-confined"); td.setAttribute("data-d", d);' +
        '  var box = td.getBoundingClientRect(), a = getComputedStyle(td, "::after"), m = a.transform.match(/matrix\\(([^)]+)\\)/)[1].split(",").map(parseFloat);' +
        '  var pl = box.left + td.clientLeft, pr = box.right - (td.offsetWidth - td.clientLeft - td.clientWidth);' +
        '  var w = ["width", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"].reduce(function (n, k) { return n + parseFloat(a[k]); }, 0);' +
        '  var left = pl + parseFloat(a.left) + m[4];' +
        '  out.rows.push({ d: d, inL: left - pl, inR: pr - (left + w), pad: a.paddingLeft + " " + a.paddingRight });' +
        '});' +
        'return out; })()';
      let r;
      for (let i = 0; i < 100; i++) { // wait for the new width to lay out
        r = await page.eval(probe);
        if (r.cw >= 34 && r.cw <= 36) break;
        await page.eval('document.querySelectorAll("#sudoku td").forEach(function (t) { t.classList.remove("hint-confined"); t.removeAttribute("data-d"); })');
        await new Promise((x) => setTimeout(x, 20));
      }
      assert.ok(r.cw >= 34 && r.cw <= 36, 'cell width at 375 px: ' + r.cw);
      r.rows.forEach((x) => {
        assert.strictEqual(x.pad, '1px 1px', 'badge ' + x.d + ' padding');
        assert.ok(x.inL >= -1 && x.inR >= -1, 'badge ' + x.d + ' outside the cell: ' + x.inL + ' / ' + x.inR);
        // flush against its own edge (left rule for 1, right rule for 9), not merely inside the 1 px tolerance
        assert.ok(Math.abs(x.d === 1 ? x.inL : x.inR) < 0.25, 'badge ' + x.d + ' not flush: ' + x.inL + ' / ' + x.inR);
      });
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
