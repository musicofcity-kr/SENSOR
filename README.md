# Sensor CSV Analyzer

Korean classroom web tool for analyzing sensor CSV files in the browser. CSV files are read with `FileReader`; they are not uploaded to the server.

## Structure

- `frontend/index.html`: browser UI and classroom workflow
- `shared/analyzer-core.js`: testable CSV parsing, column detection, cleaning, and statistics logic
- `backend/analyzer-info.js`: server-side metadata used by Vercel functions
- `api/health.js`, `api/schema.js`: small Vercel serverless endpoints
- `scripts/build-static.js`: copies frontend and shared assets to `dist/`
- `tests/`: Node test suite for core logic, APIs, build, and deployment structure
- `docs/`: PRD, implementation plan, QA notes

## Local Verification

```powershell
npm test
npm run build
npm run preview
```

The preview server defaults to `http://127.0.0.1:4173`.

## Vercel

Use these settings when importing the GitHub repository:

- Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `dist`

The API endpoints are available at `/api/health` and `/api/schema`.