# We

Small zero-dependency Node.js API.

## Run

    npm start        # listens on :3000 (or $PORT)
    npm test

## Endpoints

- `GET /health`
- `POST /claim-credit` with `{ "userId": "...", "code": "..." }`
  returns `{ amount, balance }`; each code can be claimed once.

## Simcha Lavi speaker site (`site/`)

Static, zero-build Hebrew (RTL) landing page for lecture bookings.

    npx serve site      # or: cd site && python3 -m http.server

Before going live, fill `SITE_CONFIG` at the top of `site/main.js`
(WhatsApp number, email, TikTok / YouTube links) and set `data-video`
on the "טעימה מההרצאה" button in `site/index.html`.
