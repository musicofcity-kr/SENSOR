const { sendJson, methodNotAllowed } = require("../backend/http");
const { getSchema } = require("../backend/analyzer-info");

module.exports = function handler(req, res) {
  const method = (req.method || "GET").toUpperCase();
  if (method !== "GET") return methodNotAllowed(res);
  return sendJson(res, 200, getSchema());
};