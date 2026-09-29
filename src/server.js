import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { createCreditStore } from './credits.js';

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e5) reject(new Error('payload_too_large'));
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('invalid_json'));
      }
    });
  });
}

export function createServer(store = createCreditStore()) {
  return http.createServer(async (req, res) => {
    const send = (status, data) => {
      res.writeHead(status, { 'content-type': 'application/json' });
      res.end(JSON.stringify(data));
    };

    if (req.method === 'GET' && req.url === '/health') return send(200, { status: 'ok' });

    if (req.method === 'POST' && req.url === '/claim-credit') {
      let body;
      try {
        body = await readJson(req);
      } catch (err) {
        return send(400, { error: err.message });
      }
      const { userId, code } = body;
      if (typeof userId !== 'string' || typeof code !== 'string' || !userId || !code) {
        return send(400, { error: 'userId_and_code_required' });
      }
      const result = store.claim(userId, code);
      return result.ok
        ? send(200, { amount: result.amount, balance: result.balance })
        : send(404, { error: result.error });
    }

    send(404, { error: 'not_found' });
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = process.env.PORT ?? 3000;
  createServer().listen(port, () => console.log(`listening on :${port}`));
}
