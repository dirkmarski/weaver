'use strict';
// Runs every specs/**/*.feature straight from the file: one test per scenario
// and per Examples row. Steps live in steps/, each file exports (define) => {}.
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('./gherkin');

const root = path.join(__dirname, '..');
const defs = [];
const define = (re, fn) => defs.push({ re, fn });
fs.readdirSync(path.join(__dirname, 'steps')).filter((f) => f.endsWith('.js')).sort()
  .forEach((f) => require('./steps/' + f)(define));

function features(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))
    .flatMap((e) => {
      const p = path.join(dir, e.name);
      return e.isDirectory() ? features(p) : e.name.endsWith('.feature') ? [p] : [];
    });
}

function expand(s) {
  if (!s.examples) return [{ title: s.name, steps: s.steps }];
  return s.examples.flatMap((e) => e.rows.slice(1).map((r) => {
    const v = {};
    e.rows[0].cells.forEach((h, i) => { v[h] = r.cells[i]; });
    const sub = (x) => x.replace(/<([^>]+)>/g, (a, k) => (k in v ? v[k] : a));
    const steps = s.steps.map((st) => Object.assign({}, st, {
      text: sub(st.text),
      table: st.table && st.table.map((row) => row.map(sub)),
      doc: st.doc && sub(st.doc),
    }));
    const vals = e.rows[0].cells.map((h) => h + '=' + v[h]).join(', ');
    return { title: s.name + ' [' + vals + ']', steps };
  }));
}

function resolve(step, where) {
  const hits = defs.map((d) => ({ d, m: d.re.exec(step.text) })).filter((x) => x.m);
  if (!hits.length) throw new Error(where + ': undefined step: ' + step.keyword + ' ' + step.text);
  if (hits.length > 1) {
    throw new Error(where + ': ambiguous step: ' + step.text + '\n  matches '
      + hits.map((h) => h.d.re).join('\n  and '));
  }
  return { fn: hits[0].d.fn, args: hits[0].m.slice(1).concat(step.table || step.doc ? [step.table || step.doc] : []) };
}

const files = features(path.join(root, 'specs'));
if (!files.length) test('specs: no feature files found', () => { throw new Error('specs/ has none'); });
files.forEach((file) => {
  const rel = path.relative(root, file);
  let feature;
  try { feature = parse(fs.readFileSync(file, 'utf8'), rel); } catch (e) {
    test(rel + ': parse error', () => { throw e; });
    return;
  }
  feature.scenarios.forEach((s) => expand(s).forEach((run) => {
    test(feature.name + ': ' + run.title, () => {
      const steps = (feature.background ? feature.background.steps : []).concat(run.steps);
      const todo = steps.map((st) => ({ st, r: resolve(st, rel + ':' + st.line) }));
      const world = {};
      todo.forEach(({ st, r }) => {
        try { r.fn(world, ...r.args); } catch (e) {
          e.message = rel + ':' + st.line + ': ' + st.keyword + ' ' + st.text + '\n' + e.message;
          throw e;
        }
      });
    });
  }));
});
