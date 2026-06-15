const test = require("node:test");
const assert = require("node:assert/strict");

test("catalog API returns grouped chemistry substances", async () => {
  const handler = require("../api/catalog.js");
  const response = await invoke(handler);

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers["content-type"], "application/json; charset=utf-8");
  assert.equal(response.body.count, 11);
  assert.equal(response.body.substances.water.formula, "H2O");
  assert.equal(response.body.substances.co2.state, "gas");
  assert.deepEqual(response.body.states, ["solid", "liquid", "gas"]);
});

test("catalog API rejects unsupported methods", async () => {
  const handler = require("../api/catalog.js");
  const response = await invoke(handler, { method: "POST" });

  assert.equal(response.statusCode, 405);
  assert.equal(response.body.error, "method_not_allowed");
});

test("health API returns deployment metadata", async () => {
  const handler = require("../api/health.js");
  const response = await invoke(handler);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.status, "ok");
  assert.equal(response.body.service, "mole-mass-comparator");
  assert.match(response.body.timestamp, /^\d{4}-\d{2}-\d{2}T/);
});

function invoke(handler, req = { method: "GET" }) {
  return new Promise((resolve) => {
    const res = {
      statusCode: 200,
      headers: {},
      status(code) {
        this.statusCode = code;
        return this;
      },
      setHeader(name, value) {
        this.headers[name.toLowerCase()] = value;
      },
      json(body) {
        resolve({ statusCode: this.statusCode, headers: this.headers, body });
      },
      end(body) {
        resolve({ statusCode: this.statusCode, headers: this.headers, body });
      },
    };
    handler(req, res);
  });
}
