// Minimal dependency-free Gherkin parser. parse(text, file) -> feature, or
// throws an Error whose message starts with "file:line:".
const STEP = /^(Given|When|Then|And|But)\s+(.*)$/;
const SECTION = /^(Scenario Outline|Scenario|Background|Examples|Rule|Example|Scenarios|Scenario Template):/;
const TAGGED = /^(Feature|Scenario Outline|Scenario|Examples):/;
const cells = (t) => t.replace(/^\||\|\s*$/g, '').split('|').map((s) => s.trim());

function parse(text, file) {
  const fail = (n, msg) => { throw new Error(file + ':' + n + ': ' + msg); };
  const f = { file, name: '', line: 0, tags: [], description: [], background: null, scenarios: [] };
  let tags = [], cur = null, step = null, ex = null, doc = null, desc = false;
  text.split(/\r?\n/).forEach((raw, i) => {
    const n = i + 1, t = raw.trim();
    if (doc) {
      if (t === '"""') { step.doc = doc.lines.join('\n'); doc = null; }
      else doc.lines.push(raw.slice(Math.min(doc.indent, raw.length - raw.trimStart().length)));
      return;
    }
    if (!t || t[0] === '#') return;
    if (t[0] === '@') {
      t.split(/\s+/).forEach((x) => { if (!/^@\S+$/.test(x)) fail(n, 'bad tag: ' + x); });
      tags = tags.concat(t.split(/\s+/));
      return;
    }
    if (tags.length && !TAGGED.test(t)) fail(n, 'tags must precede Feature, Scenario or Examples');
    let m = /^Feature:\s*(.*)$/.exec(t);
    if (m) {
      if (f.line) fail(n, 'second Feature');
      Object.assign(f, { name: m[1], line: n, tags }); tags = []; desc = true;
      return;
    }
    if (!f.line) fail(n, 'expected Feature, found: ' + t);
    if (t.startsWith('Background:')) {
      if (f.background || f.scenarios.length) fail(n, 'Background must come once, first');
      cur = f.background = { line: n, steps: [] }; desc = false; step = ex = null;
    } else if ((m = /^(Scenario Outline|Scenario):\s*(.*)$/.exec(t))) {
      cur = { name: m[2], line: n, tags, steps: [], examples: m[1] !== 'Scenario' ? [] : null };
      f.scenarios.push(cur); tags = []; desc = false; step = ex = null;
    } else if (t.startsWith('Examples:')) {
      if (!cur || !cur.examples) fail(n, 'Examples outside a Scenario Outline');
      ex = { line: n, tags, rows: [] }; cur.examples.push(ex); tags = []; step = null;
    } else if ((m = STEP.exec(t))) {
      if (!cur) fail(n, 'step outside a Background or Scenario');
      if (cur.examples && cur.examples.length) fail(n, 'step after Examples');
      step = { keyword: m[1], text: m[2], line: n, table: null, doc: null };
      cur.steps.push(step); ex = null;
    } else if (t[0] === '|') {
      if (ex) ex.rows.push({ line: n, cells: cells(t) });
      else if (step) (step.table = step.table || []).push(cells(t));
      else fail(n, 'table row outside a step or Examples');
    } else if (t === '"""') {
      if (!step) fail(n, 'doc string outside a step');
      doc = { indent: raw.length - raw.trimStart().length, lines: [], line: n };
    } else if (desc && !SECTION.test(t)) {
      f.description.push(t);
    } else if (/^[A-Z][A-Za-z ]*:/.test(t)) {
      fail(n, 'unsupported keyword: ' + t.split(':')[0]);
    } else {
      fail(n, 'unexpected line: ' + t);
    }
  });
  if (doc) fail(doc.line, 'unterminated doc string');
  if (tags.length) fail(text.split('\n').length, 'tags without a following keyword');
  if (!f.line) fail(1, 'no Feature found');
  f.scenarios.forEach((s) => {
    if (!s.steps.length) fail(s.line, 'scenario has no steps: ' + s.name);
    if (s.examples && !s.examples.some((e) => e.rows.length > 1)) fail(s.line, 'outline has no Examples rows');
    (s.examples || []).forEach((e) => e.rows.forEach((r) => {
      if (r.cells.length !== e.rows[0].cells.length) fail(r.line, 'row has a different number of cells');
    }));
  });
  return f;
}

export { parse };
