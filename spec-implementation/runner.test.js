// Self-check of the ATDD runner (not a spec scenario): inline features, throwaway steps.
import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from './gherkin.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { expand, execute, register } from './runner.js';

const hits = [];
const defs = [
  { re: /^ok (\w+)$/, fn: (w, x) => hits.push(x) },
  { re: /^boom$/, fn: () => assert.equal(1, 2) },
  { re: /^dup$/, fn: () => {} },
  { re: /^d(up|up)$/, fn: () => {} },
  { re: /^any (.*)$/, fn: () => {} },
];
// Runs every scenario/row of the inline feature; returns the first error or null.
function run(body) {
  const f = parse('Feature: x\n' + body, 'inline.feature');
  hits.length = 0;
  try { f.scenarios.forEach((s) => expand(s).forEach((r) => execute(defs, f, r, 'inline.feature'))); } catch (e) { return e; }
  return null;
}

test('ATDD runner: a passing scenario runs its steps', () => {
  assert.equal(run('Scenario: s\n  Given ok a\n  And ok b\n'), null);
  assert.deepEqual(hits, ['a', 'b']);
});
test('ATDD runner: an undefined step fails with file:line', () => {
  assert.match(run('Scenario: s\n  Given nope\n').message, /^inline\.feature:3: undefined step: Given nope/);
});
test('ATDD runner: an ambiguous step fails with file:line', () => {
  assert.match(run('Scenario: s\n  Given dup\n').message, /^inline\.feature:3: ambiguous step: dup/);
});
test('ATDD runner: steps are resolved before any runs', () => {
  assert.match(run('Scenario: s\n  Given ok a\n  And nope\n').message, /undefined step/);
  assert.deepEqual(hits, []);
});
test('ATDD runner: a failing assertion reports file:line, step text and the original diff', () => {
  const e = run('Scenario: s\n  Given ok a\n  Then boom\n');
  assert.match(e.message, /^inline\.feature:4: Then boom\n/);
  assert.match(e.message, /Expected values to be strictly equal/);
  assert.equal(e.cause.name, 'AssertionError');
});
test('ATDD runner: an Examples placeholder without a column fails with file:line and its name', () => {
  const e = run('Scenario Outline: s\n  Given any <y>\n  Examples:\n    | x |\n    | 1 |\n');
  assert.match(e.message, /^inline\.feature:3: no Examples column for placeholder <y>/);
});
test('ATDD runner: Examples values are substituted per row', () => {
  assert.equal(run('Scenario Outline: s\n  Given ok <x>\n  Examples:\n    | x |\n    | p |\n    | q |\n'), null);
  assert.deepEqual(hits, ['p', 'q']);
});
test('ATDD runner: a step after an Examples block is a parse error with file:line', () => {
  assert.throws(() => parse('Feature: x\nScenario Outline: s\n  Given a\n  Examples:\n    | x |\n    | 1 |\n  And b\n', 'f.feature'),
    /^Error: f\.feature:7: step after Examples/);
});
test('ATDD runner: a feature with no scenarios fails with file:line', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'atdd-'));
  fs.mkdirSync(path.join(root, 'specs'));
  fs.writeFileSync(path.join(root, 'specs', 'empty.feature'), 'Feature: empty\n');
  const tests = [];
  register((name, fn) => tests.push({ name, fn }), defs, root);
  fs.rmSync(root, { recursive: true });
  assert.equal(tests.length, 1);
  assert.throws(tests[0].fn, /^Error: specs[\\/]empty\.feature:1: feature has no scenarios/);
});
