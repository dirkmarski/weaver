// Domain steps for specs/running/local-run.feature. All assertions live here.
import assert from 'node:assert/strict';
import * as run from '../drivers/local-run.js';

export default (define) => {
  define(/^the README's "(.*)" section$/, (w, name) => {
    w.section = run.readmeSection(name);
    assert.ok(w.section, 'README.md has no "## ' + name + '" section');
  });
  define(/^it gives the command "(.*)"$/, (w, command) => {
    assert.ok(w.section.includes(command), 'the section does not give the command "' + command + '":\n' + w.section);
  });
  define(/^it says the command needs Node 22 or newer$/, (w) => {
    assert.match(w.section, /\bNode 22(\+| or newer)/, 'the section does not say "Node 22+" or "Node 22 or newer":\n' + w.section);
  });
  define(/^it gives the address "(.*)"$/, (w, address) => {
    assert.ok(w.section.includes(address), 'the section does not give the address "' + address + '":\n' + w.section);
  });

  define(/^the command "(.*)" runs from the product folder$/, (w, command) => { w.files = run.runAndFetch(command); });
  define(/^the page at the documented address loads, with every file it asks for$/, (w) => {
    const bad = w.files.filter((f) => f.status !== 200 || f.bytes === 0 || !/html|javascript|css/.test(f.type));
    assert.deepEqual(bad, [], 'files not served with 200, a body and a html/javascript/css type');
    const paths = w.files.map((f) => f.path);
    assert.ok(paths.includes('/ui.js') && paths.includes('/style.css'), 'the page did not ask for ui.js and style.css: ' + paths);
    assert.ok(paths.some((p) => p === '/generation.js' || p === '/hints.js'), 'no logic module was fetched: ' + paths);
  });
  define(/^the product needs no installed packages$/, (w) => {
    const facts = run.packageFacts();
    assert.deepEqual(facts.deps, [], 'package.json lists packages');
    const outside = facts.imports.filter((i) => !/^(\.\.?\/|node:)/.test(i.specifier));
    assert.deepEqual(outside, [], 'imports that are neither relative nor node: built-ins');
  });
};
