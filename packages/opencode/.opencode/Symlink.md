# Symbolic Link (Symlink) - Hướng dẫn chi tiết

## Symlink là gì?

Symbolic link là một shortcut/lối tắt trỏ đến file hoặc thư mục khác. Giống như shortcut trên Windows Desktop.

## Cú pháp tạo

```bash
ln -s [target_thực] [tên_symlink]
ln -s ~/my-folder/config ~/.config/app
```

## Đặc điểm chính

### ✅ Tự động cập nhật
- Khi thay đổi file gốc → symlink tự động nhận thay đổi
- Không cần update symlink

### ✅ Chỉ là con trỏ
```
symlink → target
  1KB    → 1GB (dữ liệu thực)
```

### ✅ Có thể trỏ đến:
- File
- Thư mục  
- Đường dẫn khác ổ đĩa
- Thậm chí target không tồn tại (broken link)

## Lệnh thường dùng

```bash
# Tạo symlink
ln -s /path/to/original /path/to/link

# Kiểm tra symlink
ls -la              # Hiển thị: link -> target
readlink link       # Xem target
readlink -f link    # Xem đường dẫn đầy đủ

# Xóa symlink (không ảnh hưởng target)
rm link             # Chỉ xóa link
unlink link         # Hoặc dùng unlink
```

## So sánh với Hard Link

| Tiêu chí | Symbolic Link | Hard Link |
|----------|---------------|-----------|
| Link thư mục | ✅ Có thể | ❌ Chỉ link file |
| Khác partition | ✅ Có thể | ❌ Phải cùng partition |
| Target bị xóa | ❌ Link bị broken | ✅ Link vẫn hoạt động |
| Dung lượng | ✅ Ít (1KB) | ✅ Chia sẻ inode với file gốc |

## Use case với OpenCode

```bash
# Config ở một nơi, link về .config
~/my-git-repos/opencode-config/ (Git repo - nơi thực)
           ↑
~/.config/opencode (symlink - nơi OpenCode đọc)

# Update repo → symlink tự động có bản mới
cd ~/my-git-repos/opencode-config
git pull  # → ~/.config/opencode tự động cập nhật
```

## Lưu ý quan trọng

- **Windows**: Cần quyền admin để tạo symlink
- **Backup**: Một số tool backup không theo symlink
- **Git**: Mặc định Git lưu symlink như text file chứa path

---

**Tóm lại**: Symlink = shortcut thông minh, tự động đồng bộ với target.