// Domain steps for specs/hints/*.feature. All assertions live here.
import assert from 'node:assert/strict';
import * as game from '../drivers/game.js';

export default (define) => {
  define(/^the level is (Tricky)$/, (w, level) => { w.level = level.toLowerCase(); });
  define(/^the player asks for a hint twice$/, (w) => game.hintTwice(w.game, w.level));
  define(/^the explanation's last line reads "(.*)"$/, (w, text) => {
    assert.equal(w.game.hint.text.split('\n').pop(), text);
  });
  define(/^the explanation reads:$/, (w, doc) => assert.equal(w.game.hint.text, doc));
};
