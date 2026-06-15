const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../shared/analyzer-core.js");

test("parseCSV handles BOM, quotes, commas, and empty lines", () => {
  const rows = core.parseCSV("\uFEFF수집시간,센서 1\n00:00:00.000,1\n00:00:01.000,\"2,3\"\n\n");
  assert.deepEqual(rows, [["수집시간", "센서 1"], ["00:00:00.000", "1"], ["00:00:01.000", "2,3"]]);
});

test("detectColumns identifies time and numeric sensor columns", () => {
  const rows = [["수집시간", "센서 1", "메모"], ["00:00:00.000", "10", "a"], ["00:00:01.000", "12", "b"]];
  assert.deepEqual(core.detectColumns(rows), { timeIdx: 0, valueIdx: 1 });
});

test("cleanRows converts midnight rollover into continuous elapsed seconds", () => {
  const rows = [["수집시간", "센서 1"], ["23:59:59.000", "1"], ["00:00:01.000", "3"], ["bad", "x"]];
  const result = core.cleanRows(rows, 0, 1);
  assert.equal(result.excluded, 1);
  assert.deepEqual(result.data.map((d) => d.t), [0, 2]);
});

test("calculateStats returns core trend values", () => {
  const stats = core.calculateStats([{ t: 0, v: 10, timeStr: "00:00:00" }, { t: 2, v: 14, timeStr: "00:00:02" }]);
  assert.equal(stats.count, 2);
  assert.equal(stats.first, 10);
  assert.equal(stats.last, 14);
  assert.equal(stats.totalChange, 4);
  assert.equal(stats.ratePerSec, 2);
});

test("calculateStats uses population standard deviation for classroom formulas", () => {
  const stats = core.calculateStats([
    { t: 0, v: 2, timeStr: "00:00:00" },
    { t: 1, v: 4, timeStr: "00:00:01" },
    { t: 2, v: 6, timeStr: "00:00:02" },
  ]);
  assert.equal(Math.abs(stats.stddev - Math.sqrt(8 / 3)) < 1e-12, true);
});
