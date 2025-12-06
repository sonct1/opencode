# Shell Mode

Chạy lệnh shell trực tiếp từ opencode với gợi ý thông minh.

## Sử dụng

1. Gõ `!` ở đầu input để vào shell mode
2. Nhập lệnh shell
3. Nhấn `Enter` để chạy

## Tính năng

### 1. History Autosuggestions

Gợi ý tự động từ lịch sử lệnh (giống zsh-autosuggestions):

```
┃ git st
┃ Shell atus →       ← nhấn → để hoàn thành
```

| Phím | Hành động |
|------|-----------|
| `→` hoặc `End` | Chấp nhận toàn bộ gợi ý |
| `Ctrl+→` | Chấp nhận từng từ |

### 2. Path Completion

Tự động hoàn thành file/folder khi nhấn `Tab`:

```
┃ cat wor            ← gõ "wor"
┃ Shell              
    ↓ nhấn Tab
┃ cat workspace/     ← hoàn thành thành "workspace/"
```

- Nếu có 1 kết quả khớp → hoàn thành ngay
- Nếu có nhiều kết quả → hoàn thành phần chung
- Hỗ trợ `~/`, `./`, `../`

## Phím tắt

| Phím | Hành động |
|------|-----------|
| `Tab` | Hoàn thành file/folder hoặc history |
| `→` | Chấp nhận gợi ý history |
| `Ctrl+→` | Chấp nhận từng từ |
| `Esc` | Thoát shell mode và xóa input |

## Lưu ý

- Lịch sử lệnh được lưu tại `~/.opencode_shell_history`
- Tối đa 1000 lệnh gần nhất
- Lệnh trùng sẽ được đưa lên đầu danh sách
