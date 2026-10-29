Status: In force
Date: 29 October 2026

# ADR 002: The product runs locally with one command

## Decision
- From a fresh clone, the product runs locally with one documented command that needs
  only Node and its built-in modules: no install step and no third-party packages.
- The README states that command, the Node version it needs and the address to open.

## Scope
Running the product locally. Tests may use the same server.

## Timing
Applies to every change from now on. main already complies (`node tools/serve.js`).