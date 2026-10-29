'use strict';
// ADR 001 guard. Product modules = every *.js at the repo root (a new one is picked up by the listing).
// The interface module is ui.js: the only one that may touch the page. Logic modules never import it.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const UI = 'ui.js';
const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.js')).sort();
const src = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const PAGE = /\b(document|window|globalThis|addEventListener|querySelector(All)?|getElementById|createElement|localStorage|location)\b/;
const IMPORT = /\b(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g;

test('modules: the product files are listed, with exactly one interface module', () => {
  assert.ok(files.includes(UI) && files.includes('sudoku.js'), files.join());
  assert.deepStrictEqual(files.filter((f) => PAGE.test(src(f))), [UI]);
});

for (const f of files) {
  test('modules: ' + f + ' is an ES module without wrappers or globals', () => {
    const s = src(f);
    assert.ok(/^export\s/m.test(s) || f === UI, f + ' has no export');
    assert.ok(!/module\.exports|\btypeof module\b|\brequire\(/.test(s), f + ' is CommonJS');
    assert.ok(!/^\s*;?\(\s*(async\s*)?(function\b|\(\s*\)\s*=>)|\}\s*\)\s*\(\s*\)/m.test(s), f + ' has an IIFE wrapper');
    assert.ok(!/\b(window|globalThis)\s*\.\s*\w+\s*=[^=]/.test(s), f + ' sets a global');
    if (f !== UI) {
      assert.ok(!PAGE.test(s), f + ' touches the page');
      assert.ok(![...s.matchAll(IMPORT)].some((m) => path.basename(m[1]) === UI), f + ' imports ' + UI);
    }
  });
}
