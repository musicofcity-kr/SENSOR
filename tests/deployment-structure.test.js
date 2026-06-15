const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

test("project has Vercel-ready frontend backend structure", () => {
  for (const rel of [
    "frontend/index.html",
    "shared/analyzer-core.js",
    "backend/analyzer-info.js",
    "api/health.js",
    "api/schema.js",
    "scripts/build-static.js",
    "scripts/serve-static.js",
    "public/favicon.svg",
    "package.json",
    "vercel.json",
    "README.md",
  ]) {
    assert.equal(fs.existsSync(path.join(root, rel)), true, `${rel} should exist`);
  }
});

test("original single-file analyzer remains preserved", () => {
  const original = fs.readFileSync(path.join(root, "sensor-csv-analyzer (1).html"), "utf8");
  assert.match(original, /센서 데이터 분석기/);
});

test("frontend includes shared analyzer core asset", () => {
  const html = fs.readFileSync(path.join(root, "frontend/index.html"), "utf8");
  assert.match(html, /<script src="\/assets\/analyzer-core\.js"><\/script>/);
});

test("file upload dropzone is keyboard accessible", () => {
  const html = fs.readFileSync(path.join(root, "frontend/index.html"), "utf8");
  assert.match(html, /id="dropzone"[^>]*role="button"/);
  assert.match(html, /id="dropzone"[^>]*tabindex="0"/);
  assert.match(html, /aria-label="CSV 파일 선택/);
  assert.match(html, /keydown/);
  assert.match(html, /focus-visible/);
});
