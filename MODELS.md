# 3D 模型文件说明

## 大文件处理

由于 GitHub 对单个文件有 100MB 的限制，大型 3D 模型文件（如 `500cm.glb`，约 88MB）已从 Git 仓库中移除。

## 如何获取模型文件

### 方式 1：本地已有文件
如果你本地已经有 `public/models/500cm.glb` 文件，它仍然可以正常使用，只是不会被 Git 跟踪。

### 方式 2：使用 Git LFS（推荐）
如果你需要将大文件也纳入版本控制，可以使用 Git LFS：

```bash
# 安装 Git LFS
brew install git-lfs  # macOS
# 或从 https://git-lfs.github.com/ 下载

# 初始化 Git LFS
git lfs install

# 跟踪 GLB 文件
git lfs track "public/models/*.glb"

# 添加并提交
git add .gitattributes
git add public/models/500cm.glb
git commit -m "Add 3D model using Git LFS"
git push
```

### 方式 3：使用外部存储
将大文件上传到：
- CDN（如 Cloudflare、AWS S3）
- 对象存储服务
- 然后在代码中引用外部 URL

## 当前模型文件位置

模型文件应放在：`public/models/500cm.glb`

如果文件不存在，应用会自动使用程序化生成的模型作为后备方案。

