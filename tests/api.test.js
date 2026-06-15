const test = require("node:test");
const assert = require("node:assert/strict");

function invoke(handler, req = { method: "GET" }) {
  return new Promise((resolve) => {
    const res = {
      statusCode: 200,
      headers: {},
      status(code) { this.statusCode = code; return this; },
      setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
      json(body) { resolve({ statusCode: this.statusCode, headers: this.headers, body }); },
      end(body) { resolve({ statusCode: this.statusCode, headers: this.headers, body }); },
    };
    handler(req, res);
  });
}

test("health API returns service metadata", async () => {
  const response = await invoke(require("../api/health.js"));
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.status, "ok");
  assert.equal(response.body.service, "sensor-csv-analyzer");
});

test("schema API returns expected CSV guidance", async () => {
  const response = await invoke(require("../api/schema.js"));
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.expectedColumns.time.examples.includes("수집시간"), true);
  assert.equal(response.body.privacy.fileUploadToServer, false);
});

test("schema API rejects unsupported methods", async () => {
  const response = await invoke(require("../api/schema.js"), { method: "POST" });
  assert.equal(response.statusCode, 405);
  assert.equal(response.body.error, "method_not_allowed");
});
