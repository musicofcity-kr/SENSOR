const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

test("build script creates static Vercel output", () => {
  const result = spawnSync(process.execPath, ["scripts/build-static.js"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const html = fs.readFileSync(path.join(root, "dist/index.html"), "utf8");
  const core = fs.readFileSync(path.join(root, "dist/assets/analyzer-core.js"), "utf8");
  assert.match(html, /센서 데이터 분석기/);
  assert.match(html, /\/assets\/analyzer-core\.js/);
  assert.match(core, /SensorCsvAnalyzerCore/);
  assert.equal(fs.existsSync(path.join(root, "dist/favicon.svg")), true);
});
