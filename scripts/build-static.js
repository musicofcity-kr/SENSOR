const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const assets = path.join(dist, "assets");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyPublicDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === "index.html" || entry.name === ".gitkeep") continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyPublicDir(from, to);
    } else if (entry.isFile()) {
      fs.copyFileSync(from, to);
    }
  }
}

ensureDir(dist);
ensureDir(assets);
fs.copyFileSync(path.join(root, "frontend", "index.html"), path.join(dist, "index.html"));
fs.copyFileSync(path.join(root, "shared", "analyzer-core.js"), path.join(assets, "analyzer-core.js"));
copyPublicDir(path.join(root, "public"), dist);
console.log("Built static site to dist");