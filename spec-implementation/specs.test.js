'use strict';
// Runs every specs/**/*.feature straight from the file: one test per scenario
// and per Examples row. Steps live in steps/, each file exports (define) => {}.
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { register } = require('./runner');

const defs = [];
const define = (re, fn) => defs.push({ re, fn });
fs.readdirSync(path.join(__dirname, 'steps')).filter((f) => f.endsWith('.js')).sort()
  .forEach((f) => require('./steps/' + f)(define));

register(test, defs, path.join(__dirname, '..'));
