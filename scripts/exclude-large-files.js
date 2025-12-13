#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '..', 'dist');

// 删除超过 25MB 的文件（Cloudflare Pages 限制）
function removeLargeFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist, skipping...`);
    return;
  }

  const files = fs.readdirSync(dir, { withFileTypes: true });
  let removedCount = 0;
  let totalSize = 0;

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      removeLargeFiles(filePath);
    } else {
      const stats = fs.statSync(filePath);
      const sizeInMB = stats.size / (1024 * 1024);

      // 删除超过 25MB 的文件
      if (sizeInMB > 25) {
        console.log(`Removing large file: ${filePath} (${sizeInMB.toFixed(2)} MB)`);
        fs.unlinkSync(filePath);
        removedCount++;
        totalSize += stats.size;
      }
    }
  }

  if (removedCount > 0) {
    console.log(`\nRemoved ${removedCount} large file(s), total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log('Note: Large model files should be hosted on external CDN or Cloudflare R2');
  }
}

console.log('Checking for large files in dist directory...');
removeLargeFiles(distDir);
console.log('Done!');
