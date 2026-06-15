# GitHub Vercel Frontend Backend Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the single HTML chemistry simulator into a GitHub/Vercel-ready project with separated frontend, backend API, tests, and deployment docs.

**Architecture:** Preserve the original HTML as a handoff artifact. Move the deployable UI to `frontend/index.html`, move chemical substance data into `shared/substances.json`, expose it through `api/catalog.js`, and build static frontend assets into `dist/`.

**Tech Stack:** Vanilla HTML/CSS/JS, Node.js built-in `node:test`, Vercel static output plus Serverless Functions.

---

### Task 1: Write Deployment Structure Tests

**Files:**
- Create: `tests/deployment-structure.test.js`

- [ ] **Step 1: Write failing tests**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

test("project has separated Vercel-ready source layout", () => {
  for (const rel of [
    "frontend/index.html",
    "shared/substances.json",
    "backend/catalog.js",
    "api/catalog.js",
    "api/health.js",
    "scripts/build-static.js",
    "scripts/serve-static.js",
    "public/favicon.svg",
    "vercel.json",
    "package.json",
  ]) {
    assert.equal(fs.existsSync(path.join(root, rel)), true, `${rel} should exist`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/deployment-structure.test.js`

Expected: FAIL because `frontend/index.html` and the new deployment files do not exist yet.

### Task 2: Write API and Shared Data Tests

**Files:**
- Create: `tests/api.test.js`

- [ ] **Step 1: Write failing tests**

```js
const test = require("node:test");
const assert = require("node:assert/strict");

test("catalog API returns grouped chemistry substances", async () => {
  const handler = require("../api/catalog.js");
  const response = await invoke(handler);
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.substances.water.formula, "H2O");
});

function invoke(handler) {
  return new Promise((resolve) => {
    const res = {
      statusCode: 200,
      headers: {},
      status(code) { this.statusCode = code; return this; },
      setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
      json(body) { resolve({ statusCode: this.statusCode, headers: this.headers, body }); },
      end(body) { resolve({ statusCode: this.statusCode, headers: this.headers, body }); },
    };
    handler({ method: "GET" }, res);
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/api.test.js`

Expected: FAIL because `api/catalog.js` does not exist yet.

### Task 3: Implement Minimal Structure and API

**Files:**
- Create: `shared/substances.json`
- Create: `backend/catalog.js`
- Create: `api/catalog.js`
- Create: `api/health.js`
- Create: `public/favicon.svg`
- Modify: `frontend/index.html`
- Keep: `mole-mass-comparator.html`

- [ ] **Step 1: Implement shared data from the original `SUBS` constant**
- [ ] **Step 2: Implement `backend/catalog.js` helpers**
- [ ] **Step 3: Implement Vercel handlers in `api/`**
- [ ] **Step 4: Copy original HTML into `frontend/index.html` and replace inline `SUBS` with `window.MOLE_MASS_CATALOG`**

### Task 4: Implement Build and Local Preview Scripts

**Files:**
- Create: `scripts/build-static.js`
- Create: `scripts/serve-static.js`
- Create: `package.json`
- Create: `vercel.json`
- Create: `.gitignore`

- [ ] **Step 1: Build script writes `dist/index.html` and `dist/assets/catalog.js` without deleting `dist/` recursively**
- [ ] **Step 2: Local server serves `dist/` on a configurable port**
- [ ] **Step 3: `package.json` exposes `build`, `start`, `preview`, and `test` scripts**

### Task 5: Verify, Read Claude Feedback, and Evaluate

**Files:**
- Create: `docs/QA_EVALUATION.md`

- [ ] **Step 1: Run `npm test`**
- [ ] **Step 2: Run `npm run build` twice**
- [ ] **Step 3: Run static HTML smoke check if available**
- [ ] **Step 4: Search for Claude feedback files using `rg --files | rg -i "claude|feedback|review|검수|피드백"`**
- [ ] **Step 5: Apply actionable feedback if a file exists**
- [ ] **Step 6: Record final evaluation and remaining deployment steps**
