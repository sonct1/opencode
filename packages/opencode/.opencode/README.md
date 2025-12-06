# Hướng Dẫn Thiết Lập Môi Trường OpenCode

> **Tài liệu hướng dẫn đầy đủ về cài đặt và cấu hình môi trường, công cụ để sử dụng OpenCode hiệu quả**

Tài liệu này bao gồm:
- Cài đặt các công cụ CLI cần thiết (Gemini, Qwen, AmpCode)
- Thiết lập OpenCode AI assistant
- Cấu hình CLIProxyAPI để kết nối nhiều AI providers
- Triển khai Code Graph Context cho phân tích code nâng cao

## Mục Lục

- [Công Cụ CLI Bổ Sung](#công-cụ-cli-bổ-sung)
  - [Gemini CLI](#gemini-cli)
  - [Qwen Code CLI](#qwen-code-cli)
  - [AmpCode](#ampcode)
  - [OpenCode](#opencode)
    - [Cài Đặt OpenCode](#cài-đặt-opencode)
    - [Các Lệnh Thường Dùng](#các-lệnh-thường-dùng)
- [CLIProxyAPI](#cliproxyapi)
  - [Cài Đặt CLIProxyAPI trên Linux](#cài-đặt-cliproxyapi-trên-linux)
  - [Thiết Lập Authentication](#thiết-lập-authentication)
  - [Cấu Hình CLIProxyAPI](#cấu-hình-cliproxyapi)
  - [Cấu Hình API Keys](#cấu-hình-api-keys)
  - [Cấu Hình Payload](#cấu-hình-payload-tùy-chọn)
  - [Khởi Động Service](#khởi-động-service)
  - [Kiểm Tra Trạng Thái](#kiểm-tra-trạng-thái)
  - [Xem Logs](#xem-logs)
  - [Management Center](#management-center)
- [Code Graph Context](#code-graph-context)
  - [Cài Đặt Code Graph Context](#cài-đặt-code-graph-context)
  - [Thiết Lập](#thiết-lập)
  - [Khởi Động Server](#khởi-động-server-1)
  - [Bỏ Qua Files](#bỏ-qua-files)
  - [Tương Tác Bằng Ngôn Ngữ Tự Nhiên](#tương-tác-bằng-ngôn-ngữ-tự-nhiên)
    - [Index và Theo Dõi Files](#index-và-theo-dõi-files)
    - [Truy Vấn và Hiểu Code](#truy-vấn-và-hiểu-code)
    - [Theo Dõi Call Chain và Phụ Thuộc Nâng Cao](#theo-dõi-call-chain-và-phụ-thuộc-nâng-cao)
    - [Chất Lượng và Bảo Trì Code](#chất-lượng-và-bảo-trì-code)
    - [Quản Lý Repository](#quản-lý-repository)
  - [Best Practices](#best-practices)
  - [Xử Lý Sự Cố](#xử-lý-sự-cố)
  - [Tài Nguyên Bổ Sung](#tài-nguyên-bổ-sung)

---

## Công Cụ CLI Bổ Sung

### Gemini CLI

Cài đặt công cụ dòng lệnh chính thức của Google Gemini:

```bash
npm install -g @google/gemini-cli@latest

# run
gemini --version
```

### Qwen Code CLI

Cài đặt công cụ dòng lệnh của Qwen Code:

```bash
npm install -g @qwen-code/qwen-code@latest

# run
qwen
```

### AmpCode

Cài đặt AmpCode - công cụ tăng cường productivity cho developers:

```bash
curl -fsSL https://ampcode.com/install.sh | bash

# run
amp
```

### OpenCode

OpenCode là công cụ AI assistant mạnh mẽ cho việc phát triển phần mềm.

#### Cài Đặt OpenCode

**Yêu cầu: Node.js**

**Cách 1: Cài đặt Node.js bằng NVM (Khuyến nghị)**

NVM cho phép quản lý nhiều phiên bản Node.js trên cùng một hệ thống.

1. Cài đặt NVM:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash

# Load lại cấu hình
source ~/.bashrc
```

2. Cài đặt Node.js LTS:
```bash
nvm install --lts
```

3. Kiểm tra cài đặt:
```bash
node -v
npm -v
```

**Cách 2: Cài đặt trực tiếp từ nodejs.org**

Tải và cài đặt từ [nodejs.org](https://nodejs.org/)

**Cài đặt OpenCode AI:**

Sau khi đã có npm, cài đặt OpenCode:

```bash
npm install -g opencode-ai
```

#### Các Lệnh Thường Dùng

```bash
# Hiển thị thống kê token usage và chi phí
opencode stats

# Tiếp tục phiên làm việc trước đó
opencode -c
opencode --continue

# Liệt kê tất cả models có sẵn
opencode models

# Liệt kê models của một provider cụ thể
opencode models [provider]

# authentication providers
opencode auth login
opencode auth logout
# Danh sách các authentication providers đã cấu hình
opencode auth list
```

**Ví dụ sử dụng:**
```bash
# Xem thống kê
opencode stats

# Tiếp tục làm việc
opencode -c

# Xem models Gemini
opencode models gemini

# Xem models Claude
opencode models claude

# Xem tất cả models
opencode models
```

### Quản Lý Cấu Hình OpenCode Cho Dự Án

Bạn có thể tích hợp cấu hình OpenCode vào dự án của mình bằng cách sử dụng Git subtree. Điều này cho phép bạn duy trì một bản sao cấu hình OpenCode trong dự án và dễ dàng cập nhật khi có thay đổi.

#### Thêm Cấu Hình OpenCode Vào Dự Án Mới

Để thêm cấu hình OpenCode vào một dự án chưa có cấu hình:

```bash
git subtree add --prefix=.opencode https://github.com/sonct1/opencode-config.git sonct1 --squash -m "add opencode config"
```

**Giải thích:**
- `--prefix=.opencode`: Tạo thư mục `.opencode` trong dự án để chứa cấu hình
- `https://github.com/sonct1/opencode-config.git`: Repository chứa cấu hình OpenCode
- `sonct1`: Tên branch cần pull
- `--squash`: Gộp tất cả commits thành một commit duy nhất để giữ lịch sử gọn gàng

#### Cập Nhật Cấu Hình OpenCode Trong Dự Án

Để cập nhật cấu hình OpenCode trong dự án đã có sẵn cấu hình:

```bash
git subtree pull --prefix=.opencode https://github.com/sonct1/opencode-config.git sonct1 --squash -m "update opencode config"
```

**Lưu ý:**
- Lệnh này sẽ pull các thay đổi mới nhất từ repository cấu hình OpenCode
- Sử dụng `--squash` để tránh làm rối lịch sử commit của dự án
- Nên chạy lệnh này định kỳ để cập nhật các cải tiến và tính năng mới

#### Best Practices

1. **Commit sau khi thêm/cập nhật:** Sau khi chạy lệnh subtree, hãy commit thay đổi vào dự án:
   ```bash
   git add .opencode
   git commit -m "chore: add/update OpenCode configuration"
   ```

2. **Kiểm tra cấu hình:** Sau khi thêm hoặc cập nhật, kiểm tra xem các file cấu hình đã được thêm vào đúng thư mục `.opencode`

3. **Tùy chỉnh cấu hình:** Bạn có thể tùy chỉnh các file cấu hình trong `.opencode` theo nhu cầu dự án, nhưng lưu ý rằng các thay đổi này có thể bị ghi đè khi pull cập nhật

---

## CLIProxyAPI

CLIProxyAPI là dịch vụ API tương thích với OpenAI/Gemini/Claude/Codex, cho phép bạn sử dụng nhiều nhà cung cấp AI khác nhau thông qua một giao diện thống nhất.

### Cài Đặt CLIProxyAPI trên Linux

Chạy script cài đặt tự động:

```bash
curl -fsSL https://raw.githubusercontent.com/brokechubb/cliproxyapi-installer/refs/heads/master/cliproxyapi-installer | bash
```

### Thiết Lập Authentication

Sau khi cài đặt, bạn cần thiết lập xác thực cho các nhà cung cấp AI mà bạn muốn sử dụng. Chọn một hoặc nhiều phương thức sau:

**Đăng nhập Gemini:**
```bash
./cli-proxy-api --login
```

**Đăng nhập OpenAI (Codex):**
```bash
./cli-proxy-api --codex-login
```

**Đăng nhập Claude:**
```bash
./cli-proxy-api --claude-login
```

**Đăng nhập Qwen:**
```bash
./cli-proxy-api --qwen-login
```

**Đăng nhập iFlow:**
```bash
./cli-proxy-api --iflow-login
```

> **Lưu ý:** Bạn có thể thiết lập nhiều nhà cung cấp cùng lúc. Thông tin xác thực sẽ được lưu trong thư mục được chỉ định bởi `auth-dir` trong file cấu hình.

### Cấu Hình CLIProxyAPI

Sau khi cài đặt, file cấu hình mẫu `config.yaml` sẽ được tạo tại `~/cliproxyapi/config.yaml`.

**Các thiết lập chính:**

```yaml
# Cổng server
port: 8317

# Cài đặt Amp integration
amp-upstream-url: "https://ampcode.com"
amp-restrict-management-to-localhost: true

# Cài đặt Management API
remote-management:
  allow-remote: false  # Chỉ cho phép truy cập từ localhost
  secret-key: "$2a$10$b2KXarTR/G7XfZNHvZEVtOk5XvEyiKyJoGo/Na5kUTgWPep3xZa1K"
  disable-control-panel: false

# Thư mục xác thực
auth-dir: "/home/son/.cli-proxy-api"

# API keys cho xác thực
api-keys:
  - "sk-w2MQnhPCKz92IQmb3JyZMCRyHkWgKUImHYMaU7l5Xblp3"
  - "sk-wxBiasaI0ngjtNVMz4bh26nXG8st3sQTC30ug6cWi7UtT"

# Logging và debugging
debug: false
logging-to-file: false
usage-statistics-enabled: true

# Proxy configuration (tùy chọn)
proxy-url: ""  # Hỗ trợ socks5/http/https

# Retry configuration
request-retry: 0

# Hành vi khi vượt quota
quota-exceeded:
  switch-project: true
  switch-preview-model: true
```

### Cấu Hình API Keys

**Gemini API Keys:**
```yaml
gemini-api-key:
  - api-key: "AIzaSy...01"
    base-url: "https://generativelanguage.googleapis.com"
    headers:
      X-Custom-Header: "custom-value"
    proxy-url: "socks5://proxy.example.com:1080"
  - api-key: "AIzaSy...02"
```

**Claude API Keys:**
```yaml
claude-api-key:
  - api-key: "sk-atSM..."  # API key chính thức
  - api-key: "sk-atSM..."
    base-url: "https://www.example.com"  # Custom endpoint
    headers:
      X-Custom-Header: "custom-value"
    proxy-url: "socks5://proxy.example.com:1080"
    models:
      - name: "claude-3-5-sonnet-20241022"
        alias: "claude-sonnet-latest"
```

**Codex API Keys:**
```yaml
codex-api-key:
  - api-key: "sk-atSM..."
    base-url: "https://www.example.com"
    headers:
      X-Custom-Header: "custom-value"
    proxy-url: "socks5://proxy.example.com:1080"
```

**OpenAI Compatible Providers:**
```yaml
openai-compatibility:
  - name: "openrouter"
    base-url: "https://openrouter.ai/api/v1"
    headers:
      X-Custom-Header: "custom-value"
    api-key-entries:
      - api-key: "sk-or-v1-...b780"
        proxy-url: "socks5://proxy.example.com:1080"
      - api-key: "sk-or-v1-...b781"
    models:
      - name: "moonshotai/kimi-k2:free"
        alias: "kimi-k2"
```

### Cấu Hình Payload (Tùy chọn)

Tùy chỉnh tham số cho các model cụ thể:

```yaml
payload:
  default:  # Chỉ set khi tham số chưa có
    - models:
        - name: "gemini-2.5-pro"  # Hỗ trợ wildcards (e.g., "gemini-*")
          protocol: "gemini"
      params:
        "generationConfig.thinkingConfig.thinkingBudget": 32768
  
  override:  # Luôn ghi đè tham số
    - models:
        - name: "gpt-*"
          protocol: "codex"
      params:
        "reasoning.effort": "high"
```

### Khởi Động Service

Sau khi cấu hình xong, khởi động CLIProxyAPI service:

```bash
sudo systemctl start cliproxyapi
sudo systemctl enable cliproxyapi  # Tự động khởi động khi boot
```

### Kiểm Tra Trạng Thái

```bash
sudo systemctl status cliproxyapi
```

### Xem Logs

```bash
sudo journalctl -u cliproxyapi -f
```

### Management Center

CLIProxyAPI cung cấp một trung tâm quản lý web chính thức để giám sát và cấu hình service.

**Truy cập Management Center:**

```
http://localhost:8317/management.html
```

**Tính năng:**
- Giám sát trạng thái service real-time
- Quản lý API keys
- Xem thống kê usage
- Cấu hình các provider (Gemini, Claude, Codex, OpenAI)
- Quản lý models và aliases
- Xem logs và request history

**Xác thực:**
- Yêu cầu `secret-key` được cấu hình trong `config.yaml`
- Mặc định chỉ cho phép truy cập từ localhost (có thể thay đổi với `allow-remote: true`)

**Vô hiệu hóa Management Center:**
Nếu muốn tắt control panel, thêm vào `config.yaml`:
```yaml
remote-management:
  disable-control-panel: true
```

---

## Code Graph Context

Code Graph Context là công cụ mạnh mẽ sử dụng cơ sở dữ liệu đồ thị để phân tích và hiểu các mối quan hệ code, phụ thuộc và cấu trúc trong toàn bộ dự án của bạn.

### Cài Đặt Code Graph Context

Cài đặt Code Graph Context bằng pip:

```bash
pip install codegraphcontext
```

## Thiết Lập

Chạy lệnh thiết lập tương tác:

```bash
cgc setup
```

Lệnh tương tác này sẽ hướng dẫn bạn:
- Cấu hình kết nối cơ sở dữ liệu Neo4j
- Tự động thiết lập tích hợp IDE

### Thiết Lập Local với Docker (Khuyến Nghị)

Quá trình thiết lập có thể giúp bạn cấu hình Neo4j instance trên máy local bằng Docker.

**Yêu cầu:**
- Đã cài đặt Docker
- Đã cài đặt Docker Compose

**Pull Neo4j image:**
```bash
docker pull neo4j:5.21
```

Wizard thiết lập sẽ giúp bạn tạo cấu hình Docker cần thiết để chạy Neo4j local.

## Khởi Động Server

Sau khi hoàn tất thiết lập, khởi động Code Graph Context server:

```bash
cgc start
```

Server sẽ bắt đầu chạy và sẵn sàng nhận lệnh từ AI assistant của bạn.

## Web UI Manager

Code Graph Context cung cấp giao diện web quản lý thông qua Neo4j Browser để trực quan hóa và quản lý code graph.

**Truy cập Web UI Manager:**

```
http://localhost:7474/browser/
```

**Tính năng:**
- Trực quan hóa code graph dưới dạng đồ thị
- Chạy các truy vấn Cypher trực tiếp
- Khám phá mối quan hệ giữa các nodes (files, functions, classes)
- Phân tích cấu trúc code một cách trực quan
- Giám sát trạng thái database

**Lưu ý:**
- Web UI sử dụng Neo4j Browser, được khởi động cùng với Neo4j instance
- Mặc định chỉ truy cập được từ localhost
- Thông tin đăng nhập được cấu hình trong quá trình `cgc setup`

## Bỏ Qua Files

Bạn có thể loại trừ các files và thư mục cụ thể khỏi quá trình index bằng cách tạo file `.cgcignore` trong thư mục gốc dự án. File này sử dụng cú pháp giống như `.gitignore`.

**Ví dụ `.cgcignore`:**
```
node_modules/
*.log
.git/
dist/
build/
```

## Tương Tác Bằng Ngôn Ngữ Tự Nhiên

Sau khi server chạy, bạn có thể tương tác với nó thông qua AI assistant bằng các lệnh ngôn ngữ tự nhiên.

### Index và Theo Dõi Files

**Index một dự án mới:**
- "Hãy index code trong thư mục `/path/to/my-project`."
- "Thêm dự án tại `~/dev/my-other-project` vào code graph."

**Theo dõi thư mục để cập nhật real-time:**
- "Theo dõi thư mục `/path/to/my-active-project` để phát hiện thay đổi."
- "Giữ cho code graph được cập nhật cho dự án tôi đang làm việc tại `~/dev/main-app`."

> **Lưu ý:** Khi bạn yêu cầu theo dõi một thư mục, hệ thống tự động:
> 1. Thực hiện scan đầy đủ để index toàn bộ code (trả về `job_id` để theo dõi tiến trình)
> 2. Bắt đầu theo dõi thư mục để phát hiện thay đổi file real-time

### Truy Vấn và Hiểu Code

**Tìm định nghĩa code:**
- "Hàm `process_payment` ở đâu?"
- "Tìm class `User` cho tôi."
- "Cho tôi xem code liên quan đến 'database connection'."

**Phân tích mối quan hệ và tác động:**
- "Những hàm nào khác gọi hàm `get_user_by_id`?"
- "Nếu tôi thay đổi hàm `calculate_tax`, những phần code nào khác sẽ bị ảnh hưởng?"
- "Hiển thị cây thừa kế cho class `BaseController`."
- "Class `Order` có những method nào?"

**Khám phá phụ thuộc:**
- "Những file nào import thư viện `requests`?"
- "Tìm tất cả implementation của method `render`."

### Theo Dõi Call Chain và Phụ Thuộc Nâng Cao

Code Graph Context xuất sắc trong việc truy vết luồng thực thi phức tạp trên các codebase lớn. Sử dụng công nghệ cơ sở dữ liệu đồ thị, nó có thể xác định các hàm gọi trực tiếp và gián tiếp, ngay cả khi trải qua hàng trăm files và nhiều lớp abstraction.

**Trường hợp sử dụng:**
- **Phân Tích Tác Động:** Hiểu được toàn bộ hiệu ứng domino khi thay đổi các hàm core
- **Debug:** Truy vết đường đi thực thi từ điểm vào đến bug cụ thể
- **Hiểu Code:** Nắm bắt cách các phần khác nhau của hệ thống lớn tương tác với nhau

**Ví dụ truy vấn:**
- "Hiển thị toàn bộ call chain từ hàm `main` đến `process_data`."
- "Tìm tất cả các hàm gọi trực tiếp hoặc gián tiếp đến `validate_input`."
- "Hàm `initialize_system` cuối cùng gọi những hàm nào?"
- "Truy vết các phụ thuộc của module `DatabaseManager`."

### Chất Lượng và Bảo Trì Code

**Phân tích chất lượng code:**
- "Có code chết hoặc không sử dụng nào trong dự án này không?"
- "Tính độ phức tạp cyclomatic của hàm `process_data` trong `src/utils.py`."
- "Tìm 5 hàm phức tạp nhất trong codebase."

### Quản Lý Repository

**Quản lý các repository đã index:**
- "Liệt kê tất cả repository đang được index."
- "Xóa repository đã index tại `/path/to/old-project`."

## Best Practices

1. **Bắt đầu với việc theo dõi:** Đơn giản yêu cầu theo dõi thư mục dự án đang hoạt động - nó sẽ tự động xử lý cả index ban đầu và cập nhật liên tục
2. **Sử dụng `.cgcignore`:** Loại trừ các file không cần thiết (dependencies, build artifacts) để cải thiện hiệu suất
3. **Truy vấn thường xuyên:** Sử dụng truy vấn ngôn ngữ tự nhiên để khám phá và hiểu codebase của bạn
4. **Phân tích tác động:** Trước khi thay đổi các hàm core, truy vấn call chain của chúng để hiểu tác động

## Xử Lý Sự Cố

- **Lỗi kết nối:** Đảm bảo Neo4j đang chạy và có thể truy cập được
- **Index chậm:** Kiểm tra file `.cgcignore` để loại trừ các thư mục dependency lớn
- **Server không phản hồi:** Khởi động lại bằng `cgc start` sau khi xác minh Neo4j đang chạy

## Tài Nguyên Bổ Sung

- Kiểm tra tài liệu chính thức để biết các tùy chọn cấu hình nâng cao
- Sử dụng `cgc --help` để xem các tùy chọn dòng lệnh
