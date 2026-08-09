# URL Shortener (MERN)

A simple, full‑stack URL shortening service with analytics-ready redirects, built for local development and easy deployment.

**Live preview:** Run the backend and frontend locally (instructions below).

**Highlights**
- Shorten any URL to a compact `shortId` and serve redirects.
- Track click counts for analytics and performance tuning.
- Redis caching to speed up redirects and reduce DB load.
- Clean React + Vite frontend for quick link creation and status display.

## Features
- Create short URLs via a REST API (`POST /shorten`) and receive `{ shortId, shortUrl }`.
- Redirect endpoint (`GET /:shortID`) that forwards to the original URL and increments click counts.
- Persistent storage using MongoDB (Mongoose models).
- Redis cache integration to improve redirect latency.
- Environment-driven configuration for easy local vs production setup.
- Developer-friendly tooling: `nodemon`, Vite dev server, and npm scripts.
- Well-documented README for fast onboarding.

## Tech Stack
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Cache: Redis
- Frontend: React, Vite
- Tooling: npm, nodemon, ESLint

---

## Quick Start
Prerequisites: Node.js (18+), npm, a MongoDB connection (Atlas or local) and Redis.

Backend (run in a terminal):

```bash
cd Backend
npm install
npm run dev
```

Frontend (run in a separate terminal):

```bash
cd Frontend
npm install
npm run dev
```

Open the frontend at http://localhost:5173.

## Backend configuration
Create a `Backend/.env` with:

```
MONGO_URI=your_mongo_connection_string
PORT=5000
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
```

### API Endpoints
- `POST /shorten` — body: `{ "originalUrl": "https://..." }` → response: `{ shortId, shortUrl }`
- `GET /:shortID` — redirects to the original URL and increments click count

## Frontend configuration
Create `Frontend/.env` with:

```
VITE_BACKEND_URL=http://localhost:5000
```

## Developer Tips
- Use `nodemon` for hot-reloading the backend during development.
- Redis is optional locally but recommended to reproduce production behavior.
- Update `BASE_URL` and CORS when deploying to a remote server.

## Contributing
- Fork the repo, create a feature branch, then open a PR with a clear description.

## License
This repository is available for personal and educational use. Add your preferred license if publishing.

---

If you'd like, I can also:
- Add badges and screenshots to the README.
- Add example curl requests and sample responses.
- Tailor the README for a portfolio site or GitHub project page.


