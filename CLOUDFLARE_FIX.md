# Cloudflare Pages 部署修复

## ✅ 已完成的修复

1. **创建了构建脚本** `scripts/exclude-large-files.js`
   - 自动删除超过 25MB 的文件
   - 已在本地测试成功

2. **更新了 package.json**
   - 添加了 `build:cloudflare` 命令

3. **创建了配置文件**
   - `.cloudflareignore` - 排除大文件
   - `cloudflare-pages.json` - Cloudflare 配置

## 🚀 在 Cloudflare Pages 中配置

### 步骤 1: 更新构建设置

在 Cloudflare Pages 项目设置中：

**构建命令：**
```bash
npm run build:cloudflare
```

**输出目录：**
```
dist
```

**Node.js 版本：**
```
18 或更高
```

### 步骤 2: 重新部署

保存设置后，Cloudflare 会自动重新部署。

## 📝 工作原理

1. `npm run build:cloudflare` 会：
   - 运行 `vite build` 构建项目
   - 运行 `scripts/exclude-large-files.js` 删除超过 25MB 的文件
   - 87.7 MB 的 `500cm.glb` 会被自动删除

2. 应用仍然可以运行：
   - 如果模型文件不存在，应用会使用程序化生成的模型
   - 不会影响其他功能

## 🔄 后续优化（可选）

如果需要使用真实的 3D 模型：

1. **上传到 Cloudflare R2**（推荐）
   - 创建 R2 bucket
   - 上传 `500cm.glb`
   - 获取公共 URL
   - 更新 `constants.ts` 中的 `modelUrl`

2. **使用其他 CDN**
   - AWS S3 + CloudFront
   - 其他对象存储服务

## ✅ 验证

部署成功后：
- ✅ 不再有 25MB 文件大小错误
- ✅ 应用正常加载
- ✅ 其他相机模型正常工作

