// Runs every specs/**/*.feature straight from the file: one test per scenario
// and per Examples row. Steps live in steps/, each file exports (define) => {}.
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { register } from './runner.js';

const defs = [];
const define = (re, fn) => defs.push({ re, fn });
const stepFiles = fs.readdirSync(path.join(import.meta.dirname, 'steps')).filter((f) => f.endsWith('.js')).sort();
for (const f of stepFiles) (await import('./steps/' + f)).default(define);

register(test, defs, path.join(import.meta.dirname, '..'));
