// Protocol driver for running weaver locally: reads the README, starts the real command, fetches the page.
// It performs actions and reports what it saw. It checks nothing (only failing to start or reach the server throws).
// The runner runs steps synchronously, so the server run happens in a helper process of this same file (--crawl).
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..', '..');
const PORT = 8000;

// The text of a README section: from "## <name>" to the next "## " heading.
export function readmeSection(name) {
  const text = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l === '## ' + name);
  if (start < 0) return null;
  const end = lines.findIndex((l, i) => i > start && l.startsWith('## '));
  return lines.slice(start, end < 0 ? undefined : end).join('\n');
}

// Runs "node <args>" from the product folder, fetches the page and every file it loads, stops the command.
// Returns [{ path, status, type, bytes }]. Throws if the command cannot start or never listens.
export function runAndFetch(command) {
  const [bin, ...args] = command.split(' ');
  if (bin !== 'node') throw new Error('the driver runs node commands only, got: ' + command);
  const out = execFileSync(process.execPath, [import.meta.filename, '--crawl', ...args], { cwd: ROOT, encoding: 'utf8', timeout: 30000 });
  return JSON.parse(out);
}

// Package facts: dependency fields of package.json and every import specifier of the root modules and the server.
export function packageFacts() {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const deps = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']
    .filter((k) => pkg[k] && Object.keys(pkg[k]).length).map((k) => k + ': ' + Object.keys(pkg[k]).join(', '));
  const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.js')).concat('tools/serve.js');
  const imports = files.flatMap((f) => importsOf(fs.readFileSync(path.join(ROOT, f), 'utf8')).map((s) => ({ file: f, specifier: s })));
  return { deps, imports };
}

function importsOf(source) {
  const re = /^\s*(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/gm;
  const dynamic = /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g;
  return [...source.matchAll(re), ...source.matchAll(dynamic)].map((m) => m[1]);
}

// Helper process: start the command, wait for it to listen, crawl, always stop it, print JSON.
async function crawl(args) {
  const child = spawn(process.execPath, args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  let exited = null;
  child.stdout.on('data', (d) => { log += d; });
  child.stderr.on('data', (d) => { log += d; });
  child.on('exit', (code) => { exited = code; });
  // SIGTERM (the caller's timeout) and SIGINT skip the finally below, so stop the command here.
  for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => { child.kill(); process.exit(1); });
  try {
    for (let i = 0; !/Serving /.test(log); i++) {
      if (exited !== null) {
        const busy = /EADDRINUSE/.test(log) ? ' (port ' + PORT + ' is already in use; stop what uses it)' : '';
        throw new Error('the command exited with code ' + exited + ' before it listened' + busy + '\n' + log);
      }
      if (i > 100) throw new Error('the command did not listen within 5 s\n' + log);
      await new Promise((r) => setTimeout(r, 50));
    }
    const seen = new Map();
    const queue = ['/'];
    while (queue.length) {
      const p = queue.shift();
      if (seen.has(p)) continue;
      const res = await fetch('http://127.0.0.1:' + PORT + p, { signal: AbortSignal.timeout(5000) });
      const body = await res.text();
      seen.set(p, { path: p, status: res.status, type: res.headers.get('content-type') || '', bytes: body.length });
      if (res.status !== 200) continue;
      const next = p === '/' ? [...body.matchAll(/(?:src|href)="([^":]+)"/g)].map((m) => m[1]) : p.endsWith('.js') ? importsOf(body) : [];
      for (const n of next) queue.push(new URL(n, 'http://x' + (p === '/' ? '/' : p)).pathname);
    }
    return [...seen.values()];
  } finally {
    child.kill();
  }
}

if (process.argv[2] === '--crawl') {
  crawl(process.argv.slice(3)).then((r) => console.log(JSON.stringify(r)), (e) => { console.error(e.message); process.exitCode = 1; });
}
