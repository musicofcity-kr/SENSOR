function sendJson(res, statusCode, body) {
  if (typeof res.status === "function") {
    res.status(statusCode);
  } else {
    res.statusCode = statusCode;
  }
  if (typeof res.setHeader === "function") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
  }
  return res.json(body);
}

function methodNotAllowed(res, allowed = ["GET"]) {
  if (typeof res.setHeader === "function") {
    res.setHeader("Allow", allowed.join(", "));
  }
  return sendJson(res, 405, { error: "method_not_allowed", allowed });
}

module.exports = { sendJson, methodNotAllowed };