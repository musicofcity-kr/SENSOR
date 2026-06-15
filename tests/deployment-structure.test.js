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

test("original single-file simulator remains preserved", () => {
  const original = fs.readFileSync(path.join(root, "mole-mass-comparator.html"), "utf8");
  assert.match(original, /화학식량 · 몰수 · 질량 비교 저울/);
});

test("frontend entry references generated catalog asset", () => {
  const html = fs.readFileSync(path.join(root, "frontend/index.html"), "utf8");
  assert.match(html, /<script src="\/assets\/catalog\.js"><\/script>/);
  assert.match(html, /const SUBS = window\.MOLE_MASS_CATALOG;/);
});
