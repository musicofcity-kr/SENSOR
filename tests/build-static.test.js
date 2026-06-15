const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

test("build script creates Vercel static output without public index overwrite", () => {
  const result = spawnSync(process.execPath, ["scripts/build-static.js"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);

  const distIndex = fs.readFileSync(path.join(root, "dist/index.html"), "utf8");
  const catalogAsset = fs.readFileSync(path.join(root, "dist/assets/catalog.js"), "utf8");

  assert.match(distIndex, /화학식량 · 몰수 · 질량 비교 저울/);
  assert.match(distIndex, /<script src="\/assets\/catalog\.js"><\/script>/);
  assert.match(catalogAsset, /window\.MOLE_MASS_CATALOG = /);
  assert.match(catalogAsset, /"water"/);
  assert.equal(fs.existsSync(path.join(root, "dist/favicon.svg")), true);
});
