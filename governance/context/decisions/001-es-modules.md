Status: In force
Date: 29 October 2026

# ADR 001: ES modules, one per concern

## Decision
- The product code is written as native ES modules (import/export), loaded by the browser
  and by Node without a build step or bundler.
- Each module holds one concern.
- One interface module is the only code that touches the page: the DOM, document, window
  and page events.
- Logic modules never import the interface module.

## Scope
All product code. Tests and spec-implementation/ keep their own structure, but load the
product only through its modules.

## Timing
Existing code is brought in line in the next iteration, before any new product feature.