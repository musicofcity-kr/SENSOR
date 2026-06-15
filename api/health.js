"use strict";

const { VERSION } = require("../backend/catalog");
const { methodNotAllowed, sendJson } = require("../backend/http");

module.exports = function healthHandler(req, res) {
  if (req.method && req.method !== "GET") {
    return methodNotAllowed(res);
  }

  return sendJson(res, 200, {
    status: "ok",
    service: "mole-mass-comparator",
    version: VERSION,
    timestamp: new Date().toISOString(),
  });
};
