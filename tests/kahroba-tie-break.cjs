const assert = require('node:assert/strict');

async function runTieBreak(scores) {
  const { createEngine } = await import('../supabase/functions/kb/kb_engine.mjs');
  const engine = createEngine({});
  engine.M = {
    n: 2,
    turn: 1,
    over: false,
    res: null,
    names: ['بازیکن ۱', 'بازیکن ۲'],
    wins: [0, 0],
    st: { c: [{}, {}] },
    x: {
      ph: 'act',
      pl: scores.map((n, i) => ({ t: [0, 0, 0, 0, 0, 0], c: i === 0 ? [0] : [], r: [], nb: Array(n / 3).fill(1) })),
      bank: [4, 4, 4, 4, 4, 5],
      deck: [[], [], []],
      rows: [[], [], []],
      nob: [],
      first: 0,
      ord: [0, 1],
      endAt: false,
      nc: [],
      lg: '',
      tn: 0,
      dl: 0
    }
  };
  engine.M.x.endAt = true;
  engine.M.x.rows = [[0, 1, 2, 3], [], []];
  engine.M.x.pl[1].t = [1, 1, 1, 1, 0, 0];
  assert.equal(engine.kbAct(1, 'kb', { a: 'by', s: 'row', l: 0, i: 0 }), true);
  return engine.M;
}

(async () => {
  const tied = await runTieBreak([15, 15]);
assert.equal(tied.over, false, 'a tied lead continues into another full round');
assert.equal(tied.turn, 0, 'the next round starts with the first player');
  assert.equal(tied.res, null, 'a draw is not recorded while the tie-break continues');

  const unique = await runTieBreak([15, 18]);
  assert.equal(unique.over, true, 'a unique leader ends the game');
  assert.equal(unique.res, 1, 'the unique leader is the winner');
  assert.equal(unique.wins[1], 1, 'the unique winner receives the win');
  console.log('Kahroba tie-break: tied leaders continue; unique leader wins');
})().catch(error => { console.error(error); process.exit(1); });
