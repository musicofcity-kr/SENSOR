"use strict";

const { getCatalog } = require("../backend/catalog");
const { methodNotAllowed, sendJson } = require("../backend/http");

module.exports = function catalogHandler(req, res) {
  if (req.method && req.method !== "GET") {
    return methodNotAllowed(res);
  }

  return sendJson(res, 200, getCatalog());
};
