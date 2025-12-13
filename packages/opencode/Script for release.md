## Assistant

## 🎉 Đã tạo 3 script cho bạn!

### **1. `quick-replace.sh` - Script đơn giản nhất**

```bash
./quick-replace.sh
```

**Chức năng:**
- Dừng các process OpenCode đang chạy
- Thay thế binary cũ với build mới
- Kiểm tra version mới
- **Không tạo backup**

### **2. `replace-opencode.sh` - Script chi tiết**

```bash
./replace-opencode.sh [variant]
# ví dụ: ./replace-opencode.sh linux-x64
```

**Chức năng:**
- Hỗ trợ nhiều variant (linux-x64, linux-x64-baseline, etc.)
- Kiểm tra và hiển thị thông tin chi tiết
- Verify functionality (help, models commands)
- Xử lý lỗi tốt hơn
- Output có màu sắc rõ ràng

### **3. `build-and-replace.sh` - Script đầy đủ**

```bash
./build-and-replace.sh
```

**Chức năng:**
- Tự động install dependencies
- Build OpenCode từ source
- Gọi replacement script
- **Tất cả trong 1 lệnh**

### **Sử dụng:**

**Nếu đã có build và chỉ cần replace nhanh:**
```bash
./quick-replace.sh
```

**Nếu muốn kiểm tra chi tiết và nhiều variant:**
```bash
./replace-opencode.sh linux-x64-baseline-musl
```

**Nếu muốn build và replace trong 1 lần:**
```bash
./build-and-replace.sh
```

**Tất cả script đều:**
- ✅ Không tạo backup
- ✅ Tự động kill processes
- ✅ Thay thế binary trong `/home/son/.opencode/bin/`
- ✅ Kiểm tra kết quả

Chọn script phù hợp với nhu cầu của bạn!

---

