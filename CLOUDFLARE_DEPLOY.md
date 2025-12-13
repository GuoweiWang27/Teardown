# Cloudflare Pages 部署指南

## 问题
Cloudflare Pages 单个文件大小限制为 25 MB，而 `500cm.glb` 文件为 87.7 MB。

## 解决方案

### 方案 1: 排除大文件（推荐用于快速部署）

使用构建后脚本自动删除大文件：

```bash
npm run build:cloudflare
```

这会：
1. 正常构建项目
2. 自动删除 dist 目录中超过 25MB 的文件

**注意：** 使用此方案，模型文件将不会在 Cloudflare Pages 上可用。应用会自动使用程序化生成的模型作为后备。

### 方案 2: 使用外部 CDN 托管模型文件（推荐用于生产环境）

#### 步骤 1: 上传模型文件到 CDN

将 `public/models/500cm.glb` 上传到：
- Cloudflare R2（推荐，与 Pages 集成好）
- 其他 CDN 服务（如 AWS S3 + CloudFront）

#### 步骤 2: 更新代码

修改 `constants.ts` 中的 `modelUrl`：

```typescript
{
  id: 'hasselblad-500cm',
  // ...
  modelUrl: 'https://your-cdn-domain.com/models/500cm.glb', // 使用 CDN URL
  parts: []
}
```

### 方案 3: 使用 Cloudflare R2

1. 在 Cloudflare Dashboard 创建 R2 bucket
2. 上传 `500cm.glb` 到 R2
3. 创建 R2 公共访问 URL
4. 更新 `constants.ts` 使用 R2 URL

## 当前配置

- ✅ `.cloudflareignore` - 排除大文件
- ✅ `scripts/exclude-large-files.js` - 构建后删除大文件
- ✅ `build:cloudflare` 脚本 - 用于 Cloudflare 部署

## 部署命令

在 Cloudflare Pages 设置中：

**构建命令：**
```bash
npm run build:cloudflare
```

**输出目录：**
```
dist
```

## 验证

部署后，检查：
1. 应用是否正常加载
2. 如果模型文件缺失，应用会使用程序化生成的模型
3. 控制台不应有 404 错误（如果使用外部 CDN）
