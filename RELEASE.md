# Hướng dẫn Release

## 1. Commit thay đổi

```bash
git add .
git commit -m "feat: mô tả thay đổi"
git push myfork dev --no-verify
```

## 2. Tạo tag version

```bash
git tag v1.0.xxx
git push myfork v1.0.xxx --no-verify
```

## 3. Build binaries

```bash
cd packages/opencode

# Build cho platform hiện tại
bun run build --single

# Build cho tất cả platforms
bun run build
```

## 4. Tạo Release trên GitHub

1. Vào https://github.com/sonct1/opencode/releases/new
2. Chọn tag vừa tạo
3. Điền title: `v1.0.xxx`
4. Upload files từ `packages/opencode/dist/`:
   - `opencode-linux-x64.tar.gz`
   - `opencode-linux-arm64.tar.gz`
   - `opencode-darwin-x64.zip`
   - `opencode-darwin-arm64.zip`
   - `opencode-windows-x64.zip`
5. Click **Publish release**

---

## Người dùng cài đặt/cập nhật

### Cài đặt lần đầu

```bash
curl -fsSL https://raw.githubusercontent.com/sonct1/opencode/dev/install | bash
```

### Cập nhật phiên bản mới

```bash
# Chạy lại lệnh cài đặt
curl -fsSL https://raw.githubusercontent.com/sonct1/opencode/dev/install | bash
```

### Cài đặt phiên bản cụ thể

```bash
VERSION=1.0.xxx curl -fsSL https://raw.githubusercontent.com/sonct1/opencode/dev/install | bash
```

### Kiểm tra phiên bản

```bash
opencode version
```
