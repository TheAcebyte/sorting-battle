import fs from "fs";
import path from "path";

const PAGE_BASE_DIR = "src/client";
const DIST_BASE_DIR = "dist/client";
const ASSET_EXTENSIONS = ["html", "css", "svg"];

const isAsset = file => ASSET_EXTENSIONS.some(extension => file.endsWith(extension));
const isDirectory = item => {
  const itemPath = path.join(PAGE_BASE_DIR, item);
  const stats = fs.lstatSync(itemPath);
  return stats.isDirectory();
};

const pages = fs.readdirSync(PAGE_BASE_DIR).filter(isDirectory);
for (const page of pages) {
  const pagePath = path.join(PAGE_BASE_DIR, page);
  const distPath = path.join(DIST_BASE_DIR, page);
  const files = fs.readdirSync(pagePath);
  const assets = files.filter(isAsset);

  fs.mkdirSync(distPath, { recursive: true });
  for (const asset of assets) {
    const sourcePath = path.join(pagePath, asset);
    const targetPath = path.join(distPath, asset);
    fs.copyFileSync(sourcePath, targetPath);
  }
}
