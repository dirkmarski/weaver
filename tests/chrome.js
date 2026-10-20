'use strict';
// Test helper only: finds Chrome, starts one headless instance and talks to it over the DevTools
// protocol using Node built-ins (child_process, fs, fetch, the global WebSocket). No packages.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

const DEFAULTS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'
];

// -> { path } or { skip: 'reason' }. WEAVER_NO_CHROME=1 forces the skip; CHROME_PATH, when set, is the only place looked at.
function findChrome(env) {
  if (typeof WebSocket === 'undefined') return { skip: 'page tests skipped: needs Node 22+ (global WebSocket)' };
  if (env.WEAVER_NO_CHROME) return { skip: 'page tests skipped: WEAVER_NO_CHROME is set' };
  if (env.CHROME_PATH) {
    return fs.existsSync(env.CHROME_PATH) ? { path: env.CHROME_PATH }
      : { skip: 'page tests skipped: CHROME_PATH does not exist: ' + env.CHROME_PATH };
  }
  const found = DEFAULTS.find((p) => fs.existsSync(p));
  return found ? { path: found } : { skip: 'page tests skipped: no Chrome found (set CHROME_PATH)' };
}

// Starts Chrome and opens a page. -> { eval(expr), send(method, params), close() }
async function launch(chromePath) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'weaver-chrome-'));
  const child = spawn(chromePath, ['--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run',
    '--user-data-dir=' + profile, '--remote-debugging-port=0', 'about:blank'], { detached: true, stdio: 'ignore' });
  let ws = null, closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    try { if (ws) ws.close(); } catch (e) { /* already gone */ }
    try { process.kill(-child.pid, 'SIGKILL'); } catch (e) { /* already gone */ }
    fs.rmSync(profile, { recursive: true, force: true });
  };
  process.on('exit', close); // also covers a test that throws or a crashed run
  for (const [sig, code] of [['SIGINT', 130], ['SIGTERM', 143]]) process.once(sig, () => { close(); process.exit(code); });
  try {
    let port = null;
    for (let i = 0; i < 200 && !port; i++) {
      try { port = fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]; }
      catch (e) { await new Promise((r) => setTimeout(r, 50)); }
    }
    if (!port) throw new Error('Chrome did not report a DevTools port');
    const targets = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
    ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = () => reject(new Error('DevTools connection failed')); });
    const pending = new Map();
    let id = 0;
    ws.onmessage = (m) => {
      const msg = JSON.parse(m.data);
      const p = pending.get(msg.id);
      if (!p) return;
      pending.delete(msg.id);
      if (msg.error) p.reject(new Error(msg.error.message)); else p.resolve(msg.result);
    };
    const send = (method, params) => new Promise((resolve, reject) => {
      pending.set(++id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
    // Evaluates an expression in the page; returns its JSON-able value, throws on a page error.
    const evaluate = async (expression) => {
      const r = await send('Runtime.evaluate', { expression, returnByValue: true });
      if (r.exceptionDetails) throw new Error('page error: ' + (r.exceptionDetails.exception || {}).description);
      return r.result.value;
    };
    await send('Page.enable');
    return { send, eval: evaluate, close };
  } catch (e) {
    close();
    throw e;
  }
}

module.exports = { findChrome, launch };
