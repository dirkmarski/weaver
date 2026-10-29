// ADR 001 guard. Product modules = every *.js at the repo root (a new one is picked up by the listing).
// The interface module is ui.js: the only one that may touch the page. Logic modules never import it.
import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const UI = 'ui.js';
const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.js')).sort();
const src = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const PAGE = /\b(document|window|globalThis|self|navigator|history|addEventListener|querySelector(All)?|getElementById|createElement|localStorage|location)\b/;
const IMPORT = /\b(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g;

test('modules: the product files are listed, with exactly one interface module', () => {
  assert.ok(files.includes(UI) && files.includes('board.js'), files.join());
  assert.deepStrictEqual(files.filter((f) => PAGE.test(src(f))), [UI]);
});

for (const f of files) {
  test('modules: ' + f + ' is an ES module without wrappers or globals', () => {
    const s = src(f);
    assert.ok(/^export\s/m.test(s) || f === UI, f + ' has no export');
    assert.ok(!/module\.exports|\btypeof module\b|\brequire\(/.test(s), f + ' is CommonJS');
    // A wrapper opens at column 0 or closes at the end of the file; an initialiser such as `var X = (function () {...})();` may not.
    assert.ok(!/^;?\(\s*(async\s*)?(function\b|\(\s*\)\s*=>)/m.test(s) && !/\}\s*\)\s*\(\s*\)\s*;?\s*$/.test(s),
      f + ' has an IIFE wrapper (at column 0)');
    assert.ok(!/\b(window|globalThis)\s*\.\s*\w+\s*=[^=]/.test(s), f + ' sets a global');
    if (f !== UI) {
      assert.ok(!PAGE.test(s), f + ' touches the page');
      assert.ok(![...s.matchAll(IMPORT)].some((m) => path.basename(m[1]) === UI), f + ' imports ' + UI);
    }
  });
}

test('modules: README "## Modules" lists exactly the product files, one concern each', () => {
  const sec = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8').split(/^## Modules\s*$/m)[1] ?? '';
  const listed = [...sec.split(/^## /m)[0].matchAll(/^- `([^`]+\.js)`: \S.*$/gm)].map((m) => m[1]).sort();
  assert.deepStrictEqual(listed, files);
});

test('modules: imports between product modules are acyclic and nothing re-exports', () => {
  const deps = (f) => [...src(f).matchAll(IMPORT)].map((m) => path.basename(m[1])).filter((d) => files.includes(d));
  const visit = (f, stack) => {
    assert.ok(!stack.includes(f), 'import cycle: ' + [...stack, f].join(' -> '));
    deps(f).forEach((d) => visit(d, [...stack, f]));
  };
  files.forEach((f) => visit(f, []));
  files.forEach((f) => assert.ok(!/^\s*export\s+(\*|\{[^}]*\})\s*(as\s+\w+\s*)?from\b/m.test(src(f)), f + ' re-exports'));
});
