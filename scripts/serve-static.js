const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const url = require("node:url");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function send(res, statusCode, body, type = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url || "/");
  let pathname;
  try {
    pathname = decodeURIComponent(parsed.pathname || "/");
  } catch {
    return send(res, 400, "Bad request");
  }
  if (pathname === "/") pathname = "/index.html";
  const target = path.resolve(dist, "." + pathname);
  if (target !== dist && !target.startsWith(dist + path.sep)) {
    return send(res, 403, "Forbidden");
  }
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    return send(res, 404, "Not found");
  }
  send(res, 200, fs.readFileSync(target), types[path.extname(target).toLowerCase()] || "application/octet-stream");
});

server.listen(port, host, () => {
  console.log(`Serving ${dist} at http://${host}:${port}`);
});