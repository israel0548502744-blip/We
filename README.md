# We

Small zero-dependency Node.js API.

## Run

    npm start        # listens on :3000 (or $PORT)
    npm test

## Endpoints

- `GET /health`
- `POST /claim-credit` with `{ "userId": "...", "code": "..." }`
  returns `{ amount, balance }`; each code can be claimed once.
