import fs from "fs";
import path from "path";

const PAGE_BASE_DIR = "src/client";
const DIST_BASE_DIR = "dist/client";
const isAsset = file => file.endsWith("html") || file.endsWith("css");

const pages = fs.readdirSync(PAGE_BASE_DIR);
for (const page of pages) {
  const pagePath = path.join(PAGE_BASE_DIR, page);
  const distPath = path.join(DIST_BASE_DIR, page);
  const files = fs.readdirSync(pagePath);
  const assets = files.filter(isAsset);

  fs.mkdirSync(distPath, { recursive: true });
  assets.forEach(asset => {
    const sourcePath = path.join(pagePath, asset);
    const targetPath = path.join(distPath, asset);
    fs.copyFileSync(sourcePath, targetPath);
  });
}
