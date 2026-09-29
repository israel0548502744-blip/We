import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';

async function withServer(fn) {
  const server = createServer();
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn(base);
  } finally {
    server.close();
  }
}

const post = (base, body) =>
  fetch(`${base}/claim-credit`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

test('claims a valid code once', () =>
  withServer(async (base) => {
    const ok = await post(base, { userId: 'u1', code: 'WELCOME100' });
    assert.equal(ok.status, 200);
    assert.deepEqual(await ok.json(), { amount: 100, balance: 100 });

    const again = await post(base, { userId: 'u1', code: 'WELCOME100' });
    assert.equal(again.status, 404);
  }));

test('rejects missing fields', () =>
  withServer(async (base) => {
    const res = await post(base, { userId: 'u1' });
    assert.equal(res.status, 400);
  }));
