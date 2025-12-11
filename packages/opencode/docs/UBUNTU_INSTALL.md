# 📚 Hướng Dẫn Build và Cài Đặt OpenCode trên Ubuntu

OpenCode là một AI coding agent được thiết kế cho terminal, hỗ trợ nhiều LLM providers như Anthropic, OpenAI, Google, và các local models.

## 📋 Mục lục

- [1. Yêu Cầu Hệ Thống](#1-yêu-cầu-hệ-thống)
- [2. Cài Đặt Nhanh từ Release](#2-cài-đặt-nhanh-từ-release-khuyến-nghị)
- [3. Build từ Source Code](#3-build-từ-source-code)
- [4. Cấu Hình Sau Cài Đặt](#4-cấu-hình-sau-cài-đặt)
- [5. Xác Minh Cài Đặt](#5-xác-minh-cài-đặt)
- [6. Cấu Hình Nâng Cao](#6-cấu-hình-nâng-cao)
- [7. Development Mode](#7-development-mode)
- [8. Keybinds Mặc Định](#8-keybinds-mặc-định)
- [9. Khắc Phục Sự Cố](#9-khắc-phục-sự-cố)

---

## 1. Yêu Cầu Hệ Thống

### Phần cứng
- **CPU**: x64 (với hoặc không có AVX2) hoặc ARM64
- **RAM**: Tối thiểu 4GB (khuyến nghị 8GB+)
- **Disk**: ~500MB cho cài đặt

### Phần mềm
- **OS**: Ubuntu 20.04 LTS trở lên
- **Bun**: v1.3+ (chỉ cần khi build từ source)
- **Curl**: để tải install script
- **Tar**: để giải nén (thường có sẵn)

---

## 2. Cài Đặt Nhanh từ Release (Khuyến nghị)

### Cách 1: Script cài đặt tự động

```bash
curl -fsSL https://opencode.ai/install | bash
```

Script này sẽ:
- Tự động detect OS và architecture
- Tải phiên bản phù hợp
- Cài đặt vào `~/.opencode/bin`
- Thêm vào PATH

#### Tùy chỉnh thư mục cài đặt

```bash
# Cài vào /usr/local/bin
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://opencode.ai/install | bash

# Cài vào ~/.local/bin (XDG compliant)
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://opencode.ai/install | bash
```

#### Cài đặt version cụ thể

```bash
VERSION=1.0.134 curl -fsSL https://opencode.ai/install | bash
```

### Cách 2: Sử dụng Package Manager

```bash
# NPM
npm i -g opencode-ai@latest

# Bun
bun install -g opencode-ai@latest

# PNPM
pnpm add -g opencode-ai@latest

# Yarn
yarn global add opencode-ai@latest

# Homebrew (Linux)
brew install opencode

# Arch Linux (AUR)
paru -S opencode-bin
```

### Cách 3: Tải trực tiếp từ GitHub

```bash
# Xác định architecture
ARCH=$(uname -m)
if [[ "$ARCH" == "x86_64" ]]; then
    # Kiểm tra AVX2 support
    if grep -qi avx2 /proc/cpuinfo 2>/dev/null; then
        TARGET="linux-x64"
    else
        TARGET="linux-x64-baseline"
    fi
elif [[ "$ARCH" == "aarch64" ]]; then
    TARGET="linux-arm64"
fi

echo "Detected target: $TARGET"

# Tải version mới nhất
VERSION=$(curl -s https://api.github.com/repos/sst/opencode/releases/latest | grep '"tag_name"' | sed 's/.*"v\([^"]*\)".*/\1/')
echo "Latest version: $VERSION"

# Tải và giải nén
wget "https://github.com/sst/opencode/releases/download/v${VERSION}/opencode-${TARGET}.tar.gz"
tar -xzf "opencode-${TARGET}.tar.gz"

# Di chuyển vào PATH
sudo mv opencode-${TARGET}/bin/opencode /usr/local/bin/
sudo chmod +x /usr/local/bin/opencode

# Cleanup
rm -rf "opencode-${TARGET}.tar.gz" "opencode-${TARGET}"
```

---

## 3. Build từ Source Code

### Bước 1: Cài đặt Prerequisites

```bash
# Cập nhật system
sudo apt update && sudo apt upgrade -y

# Cài đặt build essentials
sudo apt install -y build-essential git curl wget unzip
```

### Bước 2: Cài đặt Bun Runtime (yêu cầu v1.3+)

```bash
# Cài đặt Bun
curl -fsSL https://bun.sh/install | bash

# Thêm vào PATH (nếu chưa tự động)
source ~/.bashrc
# hoặc
source ~/.zshrc

# Kiểm tra version
bun --version
```

> **Note**: Bun 1.3+ là bắt buộc để build OpenCode.

### Bước 3: Clone Repository

```bash
# Clone repo
git clone https://github.com/sst/opencode.git
cd opencode

# Hoặc nếu bạn đã có repo tại /home/son/project/tools/opencode
cd /home/son/project/tools/opencode
```

### Bước 4: Cài đặt Dependencies

```bash
# Cài đặt tất cả dependencies từ root của repo
bun install
```

### Bước 5: Build OpenCode

```bash
# Di chuyển vào package opencode
cd packages/opencode

# Build cho tất cả platforms
bun run build

# HOẶC build chỉ cho platform hiện tại (nhanh hơn)
./script/build.ts --single

# HOẶC build với skip install (nếu đã có dependencies)
./script/build.ts --single --skip-install
```

### Build Output

Sau khi build, các binary sẽ nằm trong thư mục `dist/`:

| Thư mục | Mô tả |
|---------|-------|
| `opencode-linux-x64/` | Linux x64 với AVX2 support |
| `opencode-linux-x64-baseline/` | Linux x64 không có AVX2 |
| `opencode-linux-arm64/` | Linux ARM64 |
| `opencode-linux-x64-musl/` | Alpine Linux (musl libc) |
| `opencode-linux-arm64-musl/` | Alpine Linux ARM64 |

### Bước 6: Cài đặt Binary đã Build

```bash
# Xác định target phù hợp với hệ thống của bạn
# Kiểm tra AVX2 support
if grep -qi avx2 /proc/cpuinfo 2>/dev/null; then
    TARGET="opencode-linux-x64"
else
    TARGET="opencode-linux-x64-baseline"
fi

echo "Using target: $TARGET"

# Copy binary vào PATH
sudo cp dist/${TARGET}/bin/opencode /usr/local/bin/
sudo chmod +x /usr/local/bin/opencode

# Hoặc cài vào user directory
mkdir -p ~/.local/bin
cp dist/${TARGET}/bin/opencode ~/.local/bin/
chmod +x ~/.local/bin/opencode

# Đảm bảo ~/.local/bin trong PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

---

## 4. Cấu Hình Sau Cài Đặt

### Thư mục lưu trữ

OpenCode sử dụng [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html):

| Thư mục | Đường dẫn mặc định | Mô tả |
|---------|-------------------|-------|
| **Data** | `~/.local/share/opencode/` | Dữ liệu chính (storage, binaries) |
| **Storage** | `~/.local/share/opencode/storage/` | Sessions, messages, parts |
| **Logs** | `~/.local/share/opencode/log/` | Log files |
| **Cache** | `~/.cache/opencode/` | Cache (LSP, parsers, etc.) |
| **Config** | `~/.config/opencode/` | Config files |
| **State** | `~/.local/state/opencode/` | Runtime state |

### Tạo File Config Cơ Bản

```bash
# Tạo thư mục config
mkdir -p ~/.config/opencode

# Tạo file config cơ bản
cat > ~/.config/opencode/opencode.jsonc << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "theme": "dracula",
  "model": "anthropic/claude-sonnet-4-20250514",
  "small_model": "anthropic/claude-3-haiku-20240307",
  "autoupdate": "notify",
  
  "permission": {
    "edit": "ask",
    "bash": "ask",
    "webfetch": "ask"
  },
  
  "tui": {
    "scroll_speed": 1.0,
    "copy_on_select": true
  }
}
EOF
```

### Cấu hình API Keys

Thêm vào `~/.bashrc` hoặc `~/.zshrc`:

```bash
# OpenAI
export OPENAI_API_KEY="sk-..."

# Anthropic (Claude)
export ANTHROPIC_API_KEY="sk-ant-..."

# Google AI
export GOOGLE_API_KEY="..."

# Azure OpenAI
export AZURE_OPENAI_API_KEY="..."
export AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"

# OpenRouter
export OPENROUTER_API_KEY="..."
```

Sau đó reload:

```bash
source ~/.bashrc
```

---

## 5. Xác Minh Cài Đặt

```bash
# Kiểm tra version
opencode --version

# Kiểm tra help
opencode --help

# Chạy OpenCode trong một project
cd /path/to/your/project
opencode
```

### Test với Free Models

OpenCode bao gồm free models để test:

```bash
cd ~/my-project
opencode
```

---

## 6. Cấu Hình Nâng Cao

### Environment Variables

| Variable | Mô tả |
|----------|-------|
| `OPENCODE_DISABLE_AUTOUPDATE=1` | Tắt auto update |
| `OPENCODE_DISABLE_PRUNE=1` | Tắt auto prune sessions |
| `OPENCODE_DISABLE_LSP_DOWNLOAD=1` | Tắt auto download LSP servers |
| `OPENCODE_DISABLE_AUTOCOMPACT=1` | Tắt auto compact sessions |
| `OPENCODE_ENABLE_EXPERIMENTAL_MODELS=1` | Bật experimental models |
| `OPENCODE_EXPERIMENTAL=1` | Bật tất cả experimental features |
| `OPENCODE_CONFIG=/path/to/config.json` | Custom config file path |
| `OPENCODE_CONFIG_DIR=/path/to/dir` | Custom config directory |
| `OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT=1` | Tắt auto copy khi select |

### Project-specific Config

Tạo file `.opencode/opencode.jsonc` trong thư mục project:

```bash
mkdir -p .opencode
cat > .opencode/opencode.jsonc << 'EOF'
{
  "model": "openai/gpt-4o",
  "permission": {
    "edit": "allow",
    "bash": {
      "npm test": "allow",
      "npm run build": "allow",
      "rm -rf": "deny"
    }
  },
  "instructions": [
    "./CONVENTIONS.md",
    "./docs/STYLE_GUIDE.md"
  ]
}
EOF
```

### Cấu hình MCP Servers

```jsonc
{
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": ["npx", "@modelcontextprotocol/server-filesystem"],
      "enabled": true,
      "timeout": 5000
    },
    "remote-server": {
      "type": "remote",
      "url": "https://mcp-server.example.com",
      "headers": {
        "Authorization": "Bearer token"
      }
    }
  }
}
```

### Cấu hình LSP

```jsonc
{
  "lsp": {
    "typescript-language-server": {
      "command": ["typescript-language-server", "--stdio"],
      "extensions": [".ts", ".tsx", ".js", ".jsx"]
    },
    "gopls": {
      "disabled": false
    }
  }
}
```

---

## 7. Development Mode

Nếu bạn muốn phát triển và contribute cho OpenCode:

```bash
# Clone repo
cd /home/son/project/tools/opencode

# Cài dependencies
bun install

# Chạy dev mode
bun dev

# Chạy với spawn (để debug server)
bun dev spawn

# Chạy tests
bun test

# Typecheck
bun run typecheck
```

### Debug Mode

```bash
# Chạy với inspector
bun run --inspect=ws://localhost:6499/ dev

# Hoặc với wait
bun run --inspect-wait=ws://localhost:6499/ dev
```

---

## 8. Keybinds Mặc Định

| Phím tắt | Chức năng |
|----------|-----------|
| `Ctrl+X` | Leader key |
| `Ctrl+C` / `Ctrl+D` | Thoát ứng dụng |
| `<leader>e` | Mở external editor |
| `<leader>t` | Danh sách themes |
| `<leader>b` | Toggle sidebar |
| `<leader>n` | Session mới |
| `<leader>l` | Danh sách sessions |
| `<leader>g` | Timeline session |
| `<leader>m` | Danh sách models |
| `<leader>p` | Danh sách commands |
| `<leader>a` | Danh sách agents |
| `Tab` | Chuyển agent tiếp theo |
| `Shift+Tab` | Chuyển agent trước đó |
| `Escape` | Ngắt session hiện tại |
| `<leader>c` | Compact session |
| `<leader>u` | Undo message |
| `<leader>r` | Redo message |
| `<leader>y` | Copy message |
| `<leader>h` | Toggle conceal code blocks |
| `<leader>o` | Toggle bash outputs |
| `<leader>f` | Toggle file contents |
| `PageUp` / `PageDown` | Cuộn trang |
| `Ctrl+G` / `Home` | Đến message đầu |
| `Ctrl+Alt+G` / `End` | Đến message cuối |
| `Return` | Gửi input |
| `Shift+Return` / `Ctrl+J` | Xuống dòng trong input |
| `Ctrl+V` | Paste từ clipboard |
| `Up` / `Down` | Lịch sử input |
| `F2` | Chuyển model gần đây |
| `Shift+F2` | Model gần đây trước đó |
| `Ctrl+Z` | Suspend terminal |

### Built-in Agents

| Agent | Mô tả |
|-------|-------|
| `build` | Default, full access cho development |
| `plan` | Read-only, cho phân tích và exploration |
| `general` | Subagent cho complex searches |
| `explore` | Khám phá codebase |

---

## 9. Khắc Phục Sự Cố

### Xóa Cache và Dữ Liệu

```bash
# Xóa chỉ cache (LSP, parsers sẽ được download lại)
rm -rf ~/.cache/opencode

# Xóa toàn bộ dữ liệu (sessions, logs, cache)
rm -rf ~/.local/share/opencode
rm -rf ~/.cache/opencode

# Xóa tất cả (bao gồm cả config)
rm -rf ~/.local/share/opencode
rm -rf ~/.cache/opencode
rm -rf ~/.config/opencode
rm -rf ~/.local/state/opencode
```

### Lỗi Thường Gặp

#### 1. "opencode: command not found"

```bash
# Kiểm tra PATH
echo $PATH | grep -E "(opencode|\.local/bin)"

# Thêm vào PATH
echo 'export PATH="$HOME/.opencode/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

#### 2. "Error: 'tar' is required but not installed"

```bash
sudo apt install -y tar
```

#### 3. "Unsupported OS/Arch"

OpenCode hỗ trợ:
- `linux-x64` (với AVX2)
- `linux-x64-baseline` (không AVX2)
- `linux-arm64`
- `linux-x64-musl` (Alpine)
- `linux-arm64-musl` (Alpine ARM)

#### 4. Permission denied khi cài đặt

```bash
# Cài vào user directory thay vì system
OPENCODE_INSTALL_DIR=$HOME/.local/bin curl -fsSL https://opencode.ai/install | bash
```

#### 5. LSP không hoạt động

```bash
# Kiểm tra log
cat ~/.local/share/opencode/log/*.log | tail -100

# Tắt LSP download và cài thủ công
export OPENCODE_DISABLE_LSP_DOWNLOAD=1
```

### Xem Logs

```bash
# Logs mới nhất
ls -la ~/.local/share/opencode/log/
cat ~/.local/share/opencode/log/$(ls -t ~/.local/share/opencode/log/ | head -1)
```

---

## 📚 Tài Liệu Thêm

- [OpenCode Documentation](https://opencode.ai/docs)
- [GitHub Repository](https://github.com/sst/opencode)
- [Discord Community](https://discord.gg/opencode)
- [Configuration Guide](./CONFIG.md)
- [Contributing Guide](../../CONTRIBUTING.md)

---

*Cập nhật lần cuối: 2025-12-11*
