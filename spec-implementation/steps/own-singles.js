// Domain steps for specs/rewards/own-singles.feature. All assertions live here.
import assert from 'node:assert/strict';
import * as game from '../drivers/game.js';

export default (define) => {
  define(/^this puzzle, where "\." is an empty cell:$/, (w, rows) => {
    w.game = game.start(rows.map((row) => row[0]));
  });
  define(/^no technique has been applied yet in this puzzle$/, (w) => {
    game.lines(w.game).forEach((l) => assert.match(l, /: 0 on your own, 0 with a hint$/));
  });
  define(/^the player enters (\d) in row (\d), column (\d) without a hint showing$/,
    (w, d, r, c) => game.enter(w.game, Number(r), Number(c), Number(d)));
  define(/^the message reads "(.*)"$/, (w, text) => assert.equal(w.game.shown.text, text));
  define(/^the message is shown as a reward$/, (w) => {
    assert.equal(w.game.shown.kind, 'reward');
    assert.equal(w.game.shown.cssClass, 'ok');
  });
  define(/^the message is shown as not counted$/, (w) => {
    assert.equal(w.game.shown.kind, 'notCounted');
    assert.equal(w.game.shown.cssClass, '');
  });
  define(/^the techniques applied read:$/, (w, rows) => {
    assert.deepEqual(game.lines(w.game), rows.map((row) => row[0]));
  });
  define(/^the "(.*)" line reads "(.*)"$/, (w, name, text) => {
    const line = game.lines(w.game).find((l) => l.startsWith(name + ':'));
    assert.equal(line, text);
  });
  define(/^no technique count has changed$/, (w) => {
    assert.deepEqual(game.lines(w.game), game.linesBeforeLastEntry(w.game));
  });
};
