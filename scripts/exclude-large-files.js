#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const publicModelsDir = path.join(rootDir, 'public', 'models');
const distDir = path.join(rootDir, 'dist');

// 删除超过 25MB 的文件（Cloudflare Pages 限制）
function removeLargeFiles(dir, isPublicDir = false) {
  if (!fs.existsSync(dir)) {
    if (isPublicDir) {
      console.log(`Directory ${dir} does not exist, skipping...`);
    }
    return;
  }

  const files = fs.readdirSync(dir, { withFileTypes: true });
  let removedCount = 0;
  let totalSize = 0;

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      removeLargeFiles(filePath, isPublicDir);
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
    console.log(`\nRemoved ${removedCount} large file(s) from ${isPublicDir ? 'public' : 'dist'}, total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log('Note: Large model files should be hosted on external CDN or Cloudflare R2');
  }
}

// 步骤 1: 在构建前删除 public/models 中的大文件（防止被复制到 dist）
console.log('Step 1: Removing large files from public/models (before build)...');
removeLargeFiles(publicModelsDir, true);

// 步骤 2: 构建后删除 dist 中的大文件（双重保险）
console.log('\nStep 2: Checking for large files in dist directory (after build)...');
removeLargeFiles(distDir, false);

console.log('\nDone!');
