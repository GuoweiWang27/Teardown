# 立即设置 Git LFS

## 问题
Git LFS 已安装但当前终端无法识别，需要在新终端中初始化。

## 解决方案

### 步骤 1: 打开新的终端窗口
关闭当前终端，打开一个新的终端窗口（这样 PATH 会重新加载）

### 步骤 2: 在新终端中运行以下命令

```bash
cd /Users/YouMing/Desktop/测试teardown

# 验证 Git LFS 是否可用
git lfs version

# 如果显示版本号，继续下一步
# 如果还是报错，检查安装：
# - 如果通过 Homebrew 安装：brew list git-lfs
# - 如果手动安装：检查安装路径是否在 PATH 中
```

### 步骤 3: 初始化 Git LFS

```bash
git lfs install
```

### 步骤 4: 添加模型文件

```bash
# 确保 .gitattributes 已配置（已经配置好了）
git add .gitattributes

# 添加模型文件（Git LFS 会自动处理）
git add public/models/500cm.glb

# 检查文件是否被 LFS 处理
git lfs ls-files
# 应该显示：500cm.glb (87.66 MB)
```

### 步骤 5: 提交并推送

```bash
git commit -m "Add 500cm.glb model file using Git LFS"
git push origin main
```

## 如果 Git LFS 仍然无法识别

### 检查安装位置
```bash
# 查找 git-lfs
find /usr -name "git-lfs" 2>/dev/null
find /opt -name "git-lfs" 2>/dev/null
find ~ -name "git-lfs" 2>/dev/null
```

### 手动添加到 PATH
如果找到了 git-lfs，将其路径添加到 PATH：
```bash
export PATH="/path/to/git-lfs:$PATH"
```

### 或者重新安装
```bash
# 如果有 Homebrew
brew install git-lfs

# 或从官网下载：https://git-lfs.github.com/
```

