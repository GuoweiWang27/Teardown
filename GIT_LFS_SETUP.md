# Git LFS 设置指南

## 步骤 1: 安装 Git LFS

### 方式 1: 使用 Homebrew (推荐)
```bash
brew install git-lfs
```

### 方式 2: 手动下载安装
1. 访问 https://git-lfs.github.com/
2. 下载 macOS 安装包
3. 运行安装程序

## 步骤 2: 初始化 Git LFS

安装完成后，在项目目录运行：

```bash
cd /Users/YouMing/Desktop/测试teardown
git lfs install
```

## 步骤 3: 配置跟踪 GLB 文件

```bash
git lfs track "public/models/*.glb"
```

这会更新 `.gitattributes` 文件（已经创建好了）。

## 步骤 4: 添加并提交文件

```bash
# 添加 .gitattributes（如果还没有添加）
git add .gitattributes

# 添加模型文件（Git LFS 会自动处理）
git add public/models/500cm.glb

# 提交
git commit -m "Add 500cm.glb model file using Git LFS"

# 推送到 GitHub
git push origin main
```

## 验证 Git LFS 是否正常工作

```bash
# 检查 Git LFS 状态
git lfs ls-files

# 应该看到：
# 500cm.glb (87.66 MB)
```

## 注意事项

- Git LFS 需要 GitHub 账户
- GitHub Free 计划提供 1 GB 存储和 1 GB 带宽/月
- 如果超出限制，可能需要升级计划

## 故障排除

如果遇到问题：
1. 确认 Git LFS 已正确安装：`git lfs version`
2. 确认已初始化：`git lfs install`
3. 检查 `.gitattributes` 文件是否存在且正确配置

