# Tính năng Snapshot trong OpenCode

## Tổng quan

Snapshot là một tính năng được **bật theo mặc định** trong OpenCode, cho phép theo dõi và lưu trữ trạng thái của các file trong dự án. Tính năng này hoạt động như một hệ thống checkpoint, giúp người dùng có thể quay lại các trạng thái trước đó của codebase khi cần thiết.

## Cấu hình

### Giá trị mặc định

- **Mặc định**: `true` (bật)
- **Cách tắt**: Thêm `"snapshot": false` vào file config

### File config

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "snapshot": true, // Bật (mặc định)
}
```

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "snapshot": false, // Tắt
}
```

### Vị trí config

- Global: `~/.config/opencode/opencode.json`
- Project: `opencode.json` hoặc `opencode.jsonc` trong thư mục dự án

## Điều kiện hoạt động

1. **Yêu cầu Git**: Chỉ hoạt động trong các dự án sử dụng Git
2. **Tự động kích hoạt**: Khi có thay đổi file trong dự án
3. **Theo dõi thông minh**: Tự động tạo snapshot khi cần thiết

## Cách hoạt động

### 1. Tự động tracking

```typescript
// Logic trong snapshot/index.ts
export async function track() {
  if (Instance.project.vcs !== "git") return // Kiểm tra Git
  const cfg = await Config.get()
  if (cfg.snapshot === false) return // Kiểm tra config

  // Tạo snapshot mới
  const hash = await $`git write-tree`
  return hash.trim()
}
```

### 2. Storage location

- **Path**: `~/.config/opencode/data/snapshot/{project-id}/`
- **Format**: Sử dụng Git tree objects
- **Isolation**: Mỗi dự án có storage riêng biệt

## Lệnh CLI

### Debug commands

```bash
# Tạo snapshot thủ công
opencode debug snapshot track

# Xem các thay đổi từ một snapshot
opencode debug snapshot patch <hash>

# Xem diff từ một snapshot
opencode debug snapshot diff <hash>
```

## API Usage

### Basic operations

```typescript
import { Snapshot } from "@/snapshot"

// Tạo snapshot mới
const snapshot = await Snapshot.track()

// Lấy các file thay đổi
const patch = await Snapshot.patch(snapshot)

// Lấy diff đầy đủ
const diff = await Snapshot.diff(snapshot)

// Restore snapshot
await Snapshot.restore(snapshot)

// Revert các thay đổi
await Snapshot.revert([patch])
```

## Integration với Session

### Session tracking

```typescript
// Trong session processor
if (snapshot) {
  const patch = await Snapshot.patch(snapshot)
  // Lưu patch vào session để revert sau này
}
```

### Revert functionality

```typescript
// Trong revert logic
if (session.revert.snapshot) {
  await Snapshot.restore(session.revert.snapshot)
}
```

## File types được theo dõi

- **Tất cả files** trong working directory
- **Binary files** được hỗ trợ
- **Deleted files** được theo dõi
- **New files** được tự động thêm vào

## Performance considerations

### Khi nào snapshot được tạo

1. **Trước khi thực hiện operations**: Khi agent sắp thay đổi files
2. **Sau khi hoàn thành**: Để lưu trạng thái cuối cùng
3. **Khi cần revert**: Để có điểm tham chiếu

### Optimization

- **Git-based**: Sử dụng Git's efficient tree objects
- **Incremental**: Chỉ lưu thay đổi, không duplicate
- **Lazy creation**: Chỉ tạo khi cần thiết

## Testing

### Test cases

```typescript
// Test basic tracking
test("tracks deleted files correctly", async () => {
  const before = await Snapshot.track()
  // Xóa file
  await $`rm file.txt`
  const patch = await Snapshot.patch(before)
  expect(patch.files).toContain("file.txt")
})

// Test revert functionality
test("revert should remove new files", async () => {
  const before = await Snapshot.track()
  // Tạo file mới
  await Bun.write("new.txt", "content")
  await Snapshot.revert([await Snapshot.patch(before)])
  // File mới nên bị xóa
})
```

## Troubleshooting

### Common issues

1. **Snapshot không hoạt động**
   - Kiểm tra xem có phải Git repository không
   - Kiểm tra config `snapshot: false`

2. **Storage đầy**
   - Xóa các snapshot cũ trong `~/.config/opencode/data/snapshot/`
   - Giới hạn số lượng snapshot

3. **Performance chậm**
   - Kiểm tra số lượng files lớn
   - Xem xét ignore patterns

### Debug information

```typescript
// Enable debug logging
const log = Log.create({ service: "snapshot" })
log.info("tracking", { hash, cwd: Instance.directory })
```

## Best practices

### 1. Configuration

```jsonc
{
  "snapshot": true,
  "watcher": {
    "ignore": ["node_modules/**", "*.log", ".git/**"],
  },
}
```

### 2. Usage patterns

- **Manual snapshots**: Trước khi thực hiện các thay đổi lớn
- **Automatic snapshots**: Để có safety net
- **Regular cleanup**: Để tránh storage issues

### 3. Integration với workflows

```typescript
// Trong custom commands
const snapshot = await Snapshot.track()
try {
  // Thực hiện operations
  await performChanges()
} catch (error) {
  // Revert nếu có lỗi
  await Snapshot.restore(snapshot)
  throw error
}
```

## Security considerations

- **Local storage**: Snapshots chỉ lưu locally
- **No sensitive data exposure**: Không upload lên server
- **Git-based security**: Sử dụng Git's security model

## Limitations

1. **Git-only**: Chỉ hoạt động với Git repositories
2. **Local-only**: Không sync giữa machines
3. **Storage dependency**: Cần đủ disk space
4. **Large projects**: Có thể chậm với projects rất lớn

## Future improvements

- **Compression**: Nén snapshots để tiết kiệm space
- **Remote sync**: Sync snapshots giữa machines
- **Smart ignore**: Tự động ignore files không cần thiết
- **Performance optimization**: Cải thiện performance cho large projects

## Examples

### Basic usage

```bash
# Kiểm tra snapshot đang hoạt động
opencode debug snapshot track

# Thực hiện thay đổi
echo "new content" > file.txt

# Revert thay đổi
# (Thông qua session revert functionality)
```

### Advanced usage

```typescript
// Custom snapshot management
class SnapshotManager {
  async createCheckpoint(name: string) {
    const snapshot = await Snapshot.track()
    await this.saveCheckpoint(name, snapshot)
  }

  async restoreCheckpoint(name: string) {
    const snapshot = await this.getCheckpoint(name)
    await Snapshot.restore(snapshot)
  }
}
```

---

_Document này được tạo dựa trên phân tích codebase OpenCode tại thời điểm viết. Các tính năng có thể thay đổi trong các phiên bản tương lai._
