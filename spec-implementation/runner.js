// The ATDD runner: feature discovery, Examples expansion, step resolution and
// execution. Used by specs.test.js and by runner.test.js (the runner self-check).
import fs from 'node:fs';
import path from 'node:path';
import { parse } from './gherkin.js';

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
    const steps = s.steps.map((st) => {
      const unbound = [];
      const sub = (x) => x.replace(/<([^>]+)>/g, (a, k) => { if (k in v) return v[k]; unbound.push(k); return a; });
      return Object.assign({}, st, {
        text: sub(st.text),
        table: st.table && st.table.map((row) => row.map(sub)),
        doc: st.doc && sub(st.doc),
        unbound,
      });
    });
    const vals = e.rows[0].cells.map((h) => h + '=' + v[h]).join(', ');
    return { title: s.name + ' [' + vals + ']', steps };
  }));
}

function resolve(defs, step, where) {
  if (step.unbound && step.unbound.length) {
    throw new Error(where + ': no Examples column for placeholder <' + step.unbound[0] + '>: ' + step.text);
  }
  const hits = defs.map((d) => ({ d, m: d.re.exec(step.text) })).filter((x) => x.m);
  if (!hits.length) throw new Error(where + ': undefined step: ' + step.keyword + ' ' + step.text);
  if (hits.length > 1) {
    throw new Error(where + ': ambiguous step: ' + step.text + '\n  matches '
      + hits.map((h) => h.d.re).join('\n  and '));
  }
  return { fn: hits[0].d.fn, args: hits[0].m.slice(1).concat(step.table || step.doc ? [step.table || step.doc] : []) };
}

// Runs one scenario (or Examples row): all steps are resolved before any runs.
// A failing step is rethrown with its feature file:line and step text, keeping
// the original message (and diff) and the original error as cause.
function execute(defs, feature, run, rel) {
  const steps = (feature.background ? feature.background.steps : []).concat(run.steps);
  const todo = steps.map((st) => ({ st, r: resolve(defs, st, rel + ':' + st.line) }));
  const world = {};
  todo.forEach(({ st, r }) => {
    try { r.fn(world, ...r.args); } catch (e) {
      throw new Error(rel + ':' + st.line + ': ' + st.keyword + ' ' + st.text + '\n' + e.message, { cause: e });
    }
  });
}

function register(test, defs, root) {
  const files = features(path.join(root, 'specs'));
  if (!files.length) test('specs: no feature files found', () => { throw new Error('specs/ has none'); });
  files.forEach((file) => {
    const rel = path.relative(root, file);
    let feature;
    try { feature = parse(fs.readFileSync(file, 'utf8'), rel); } catch (e) {
      test(rel + ': parse error', () => { throw e; });
      return;
    }
    if (!feature.scenarios.length) {
      test(rel + ': no scenarios', () => { throw new Error(rel + ':' + feature.line + ': feature has no scenarios'); });
      return;
    }
    feature.scenarios.forEach((s) => expand(s).forEach((run) => {
      test(feature.name + ': ' + run.title, () => execute(defs, feature, run, rel));
    }));
  });
}

export { expand, execute, register };
