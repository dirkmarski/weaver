// Domain steps for specs/rewards/own-step-marks.feature. All assertions live here.
import assert from 'node:assert/strict';
import * as game from '../drivers/game.js';

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a - 1 + i);
// Cells (flat 9*r + c) of a unit named as in the feature: "row 1", "column 6", "the box of rows 1-3 and columns 7-9".
function unitCells(name) {
  let m = name.match(/^row (\d)$/);
  if (m) return range(1, 9).map((c) => (m[1] - 1) * 9 + c);
  if (m = name.match(/^column (\d)$/)) return range(1, 9).map((r) => r * 9 + Number(m[1]) - 1);
  m = name.match(/^the box of rows (\d)-(\d) and columns (\d)-(\d)$/);
  assert.ok(m, 'unknown unit: ' + name);
  return range(+m[1], +m[2]).flatMap((r) => range(+m[3], +m[4]).map((c) => r * 9 + c));
}
const cellOf = (name) => {
  const m = name.match(/^row (\d), column (\d)$/);
  assert.ok(m, 'unknown cell: ' + name);
  return (m[1] - 1) * 9 + m[2] - 1;
};
const sorted = (cells) => [...new Set(cells)].sort((a, b) => a - b);

export default (define) => {
  define(/^the player has entered (\d) in row (\d), column (\d) without a hint showing$/,
    (w, d, r, c) => game.enter(w.game, Number(r), Number(c), Number(d)));
  // The amber area is compared as the union of the cells of the named units (the feature says "every cell").
  define(/^the amber area is:$/, (w, rows) => {
    assert.deepEqual(sorted(game.marks(w.game).area), sorted(rows.flatMap((row) => unitCells(row[0]))));
  });
  define(/^the dashed purple (\d) marks:$/, (w, d, rows) => {
    assert.deepEqual(sorted(game.marks(w.game).confined), sorted(rows.map((row) => cellOf(row[0]))));
  });
  define(/^the struck grey (\d) marks:$/, (w, d, rows) => {
    assert.deepEqual(sorted(game.marks(w.game).removed), sorted(rows.map((row) => cellOf(row[0]))));
  });
  define(/^no cell is struck$/, (w) => assert.deepEqual(game.marks(w.game).removed, []));
  define(/^no cell is marked$/, (w) => {
    const m = game.marks(w.game);
    assert.deepEqual([m.area, m.confined, m.removed], [[], [], []]);
  });
  define(/^the key line reads "(.*)"$/, (w, text) => assert.equal(game.marks(w.game).key, text));
  define(/^the key line is empty$/, (w) => assert.equal(game.marks(w.game).key, ''));
};
