# Sensor CSV Analyzer GitHub Vercel Implementation Plan

**Goal:** Convert the single-file sensor CSV analyzer into a GitHub/Vercel-ready static frontend plus serverless API project.

**Architecture:** Preserve the original HTML as a source artifact. Use `frontend/index.html` as the deployable UI, `shared/analyzer-core.js` for tested CSV/time/stat helpers, and `api/` for Vercel metadata endpoints.

**Tasks:**

1. Write failing tests for project structure, API behavior, analyzer core behavior, and build output.
2. Implement shared analyzer core with CSV parsing, column detection, time parsing, row cleaning, and stats.
3. Implement Vercel API handlers for health and expected CSV schema metadata.
4. Copy the original app to `frontend/index.html` and include the shared browser core asset.
5. Implement overwrite-only build and local preview scripts.
6. Run tests, build, static smoke, security scans, feedback-file scan, and final evaluation.
7. Upload the verified project to `musicofcity-kr/SENSOR`.
