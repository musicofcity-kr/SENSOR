"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const frontendDir = path.join(root, "frontend");
const sharedDir = path.join(root, "shared");
const publicDir = path.join(root, "public");
const distDir = path.join(root, "dist");
const distAssetsDir = path.join(distDir, "assets");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyPublicAssets(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    return;
  }

  ensureDir(destDir);

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (entry.name === "index.html" || entry.name === ".gitkeep") {
      continue;
    }

    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyPublicAssets(src, dest);
    } else if (entry.isFile()) {
      fs.copyFileSync(src, dest);
    }
  }
}

function buildCatalogAsset() {
  const catalogPath = path.join(sharedDir, "substances.json");
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const payload = JSON.stringify(catalog, null, 2);
  return `"use strict";\nwindow.MOLE_MASS_CATALOG = Object.freeze(${payload});\n`;
}

function build() {
  ensureDir(distDir);
  ensureDir(distAssetsDir);

  const html = fs.readFileSync(path.join(frontendDir, "index.html"), "utf8");
  fs.writeFileSync(path.join(distDir, "index.html"), html, "utf8");
  fs.writeFileSync(path.join(distAssetsDir, "catalog.js"), buildCatalogAsset(), "utf8");
  copyPublicAssets(publicDir, distDir);

  console.log("Built static site to dist/");
}

build();
