"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const port = Number(process.env.PORT || process.argv[2] || 5173);
const host = process.env.HOST || "127.0.0.1";

const MIME = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function resolveRequestPath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const candidate = path.normalize(path.join(distDir, relative));

  if (!candidate.startsWith(distDir)) {
    return null;
  }

  return candidate;
}

const server = http.createServer((req, res) => {
  const filePath = resolveRequestPath(req.url || "/");

  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  res.writeHead(200, {
    "content-type": MIME[path.extname(filePath)] || "application/octet-stream",
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(port, host, () => {
  console.log(`Serving dist/ at http://${host}:${port}/`);
});
