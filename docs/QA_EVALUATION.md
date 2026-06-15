# QA Evaluation

Date: 2026-06-15

## Summary

GitHub/Vercel deployment structure was added around the existing chemistry simulator. The app now has a separated frontend, shared data, serverless API handlers, build scripts, tests, and deployment docs.

## Claude Feedback Applied

- P1: Added adaptive mole formatting with `fmtMol`.
- Updated `mole-mass-comparator.html` and `frontend/index.html`.
- Small values such as sugar at 1 g now display as `0.003 mol` instead of `0.00 mol`.
- Calculation values and comparison bar ratios were not changed.

## Verification

```text
node --test tests/*.test.js
PASS 9 / FAIL 0
```

```text
npm test
PASS 9 / FAIL 0
```

```text
npm run build
Built static site to dist/
```

```text
SERDx HTML Smoke Check: dist/index.html
PASS 8 / WARN 1 / FAIL 0
```

```text
HTTP smoke
/ -> 200
/assets/catalog.js -> 200
/favicon.svg -> 200
```

```text
Playwright render check
title: 화학식량 · 몰수 · 질량 비교 저울
mass mode, 1 g sugar: 0.003 mol
console errors: 0
```

## Residual Notes

- Static smoke warning: the HTML has no explicit `try` or `onerror` marker. This is non-blocking because the page loaded, catalog data loaded, and console errors were 0 in browser verification.
- The folder is not currently initialized as a Git repository. Run `git init` or add these files to an existing GitHub repo before pushing.
- Vercel settings: Framework Preset `Other`, Build Command `npm run build`, Output Directory `dist`.

## Privacy and Security Review

| Item | Result |
|---|---|
| Student names, IDs, grades, submissions | Not collected |
| Browser storage | No `localStorage` or `sessionStorage` use |
| Secrets/API keys | No hardcoded key/token patterns found |
| External APIs | None; `/api/catalog` only returns local chemistry reference data |
| Teacher/student permission split | Not applicable because there is no login, dashboard, or saved student data |
| Public link risk | Low; public page exposes only lesson UI and chemistry constants |

Verdict: deployable as a public classroom reference tool after normal Vercel URL smoke checks.

## Final Subagent Review

Read-only final review found no blocking issues.

Non-blocking notes:

- `mole-mass-comparator.html` and `frontend/index.html` intentionally overlap. The root HTML is kept as the original handoff/single-file copy, while `frontend/index.html` is the deployable source entry.
- The frontend intentionally consumes the build-generated `/assets/catalog.js` instead of calling `/api/catalog` at runtime. This keeps the classroom simulator static-first and avoids a runtime network dependency; `/api/catalog` remains available as the backend data endpoint for Vercel/API checks.
- GitHub push itself was not performed because this folder has no `.git` remote yet.
