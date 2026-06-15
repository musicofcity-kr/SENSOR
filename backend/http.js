"use strict";

function sendJson(res, statusCode, body, extraHeaders = {}) {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    ...extraHeaders,
  };

  for (const [name, value] of Object.entries(headers)) {
    if (typeof res.setHeader === "function") {
      res.setHeader(name, value);
    }
  }

  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json(body);
  }

  res.statusCode = statusCode;
  if (typeof res.end === "function") {
    return res.end(JSON.stringify(body));
  }

  return undefined;
}

function methodNotAllowed(res, allowed = ["GET"]) {
  return sendJson(
    res,
    405,
    {
      error: "method_not_allowed",
      allowed,
    },
    {
      allow: allowed.join(", "),
    },
  );
}

module.exports = {
  methodNotAllowed,
  sendJson,
};
