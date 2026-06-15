const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

for (const rel of ["mole-mass-comparator.html", "frontend/index.html"]) {
  test(`${rel} formats very small mole values without rounding to zero`, () => {
    const html = fs.readFileSync(path.join(root, rel), "utf8");
    const match = html.match(/const fmtMol = ([^;]+);/);

    assert.ok(match, "fmtMol helper should exist in the frontend script");

    const fmtMol = vm.runInNewContext(`(${match[1]})`);
    assert.equal(fmtMol(1 / 342.297), "0.003");
    assert.equal(fmtMol(1), "1.00");
    assert.doesNotMatch(html, /m\\.n\\.toFixed\\(2\\)<span class="u"> mol/);
  });
}
