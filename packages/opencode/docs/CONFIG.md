# OpenCode Configuration Guide

## Tính năng mặc định (Built-in Features)

### Copy Selection (Tự động)
- **Mouse select** text bất kỳ → tự động copy vào clipboard khi thả chuột
- Sử dụng **OSC52** escape sequence (hỗ trợ cả trong tmux)
- Không cần keybind, hoạt động tự động
- **Tắt tính năng này:**
  - Qua JSON config:
    ```jsonc
    {
      "tui": {
        "copy_on_select": false
      }
    }
    ```
  - Hoặc qua environment variable:
    ```bash
    export OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT=1
    ```

### Các tính năng khác mặc định bật:
- **LSP** - Language Server Protocol cho code intelligence
- **Formatter** - Auto format code
- **File watcher** - Theo dõi thay đổi file
- **Autoupdate** - Kiểm tra phiên bản mới (mặc định: notify)

---

## Keybinds mặc định

| Keybind | Mặc định | Mô tả |
|---------|----------|-------|
| `leader` | `ctrl+x` | Leader key cho các tổ hợp phím |
| `app_exit` | `ctrl+c,ctrl+d,<leader>q` | Thoát ứng dụng |
| `editor_open` | `<leader>e` | Mở external editor |
| `theme_list` | `<leader>t` | Danh sách themes |
| `sidebar_toggle` | `<leader>b` | Toggle sidebar |
| `scrollbar_toggle` | `none` | Toggle scrollbar |
| `username_toggle` | `none` | Toggle hiển thị username |
| `status_view` | `<leader>s` | Xem status |
| `session_export` | `<leader>x` | Export session ra editor |
| `session_new` | `<leader>n` | Tạo session mới |
| `session_list` | `<leader>l` | Danh sách sessions |
| `session_timeline` | `<leader>g` | Timeline của session |
| `session_share` | `none` | Share session |
| `session_unshare` | `none` | Unshare session |
| `session_interrupt` | `escape` | Ngắt session hiện tại |
| `session_compact` | `<leader>c` | Compact session |
| `messages_page_up` | `pageup` | Cuộn lên 1 trang |
| `messages_page_down` | `pagedown` | Cuộn xuống 1 trang |
| `messages_half_page_up` | `ctrl+alt+u` | Cuộn lên nửa trang |
| `messages_half_page_down` | `ctrl+alt+d` | Cuộn xuống nửa trang |
| `messages_first` | `ctrl+g,home` | Đến message đầu tiên |
| `messages_last` | `ctrl+alt+g,end` | Đến message cuối cùng |
| `messages_last_user` | `none` | Đến message user cuối |
| `messages_copy` | `<leader>y` | Copy message |
| `messages_undo` | `<leader>u` | Undo message |
| `messages_redo` | `<leader>r` | Redo message |
| `messages_toggle_conceal` | `<leader>h` | Ẩn/hiện code blocks |
| `tool_details` | `none` | Toggle chi tiết tools |
| `bash_output_toggle` | `<leader>o` | Toggle tất cả bash outputs |
| `file_content_toggle` | `<leader>f` | Toggle tất cả file contents |
| `model_list` | `<leader>m` | Danh sách models |
| `model_cycle_recent` | `f2` | Model gần đây tiếp theo |
| `model_cycle_recent_reverse` | `shift+f2` | Model gần đây trước đó |
| `command_list` | `ctrl+p` | Danh sách commands |
| `agent_list` | `<leader>a` | Danh sách agents |
| `agent_cycle` | `tab` | Agent tiếp theo |
| `agent_cycle_reverse` | `shift+tab` | Agent trước đó |
| `input_clear` | `ctrl+c` | Xóa input |
| `input_forward_delete` | `ctrl+d` | Forward delete |
| `input_paste` | `ctrl+v` | Paste từ clipboard |
| `input_submit` | `return` | Gửi input |
| `input_newline` | `shift+return,ctrl+j` | Xuống dòng trong input |
| `history_previous` | `up` | Lịch sử trước đó |
| `history_next` | `down` | Lịch sử tiếp theo |
| `session_child_cycle` | `<leader>right` | Child session tiếp theo |
| `session_child_cycle_reverse` | `<leader>left` | Child session trước đó |
| `terminal_suspend` | `ctrl+z` | Suspend terminal |

---

## Tất cả Config có thể cấu hình

### Cơ bản

| Field | Type | Mô tả |
|-------|------|-------|
| `$schema` | `string` | JSON schema reference |
| `theme` | `string` | Tên theme sử dụng |
| `model` | `string` | Model chính (format: `provider/model`) |
| `small_model` | `string` | Model nhỏ cho tasks như title generation |
| `username` | `string` | Username hiển thị thay vì system username |

### Sharing & Updates

| Field | Type | Mô tả |
|-------|------|-------|
| `share` | `"manual"` \| `"auto"` \| `"disabled"` | Kiểm soát sharing behavior |
| `autoshare` | `boolean` | **Deprecated** - Dùng `share` thay thế |
| `autoupdate` | `boolean` \| `"notify"` | Tự động cập nhật phiên bản mới |

### Providers

| Field | Type | Mô tả |
|-------|------|-------|
| `disabled_providers` | `string[]` | Mảng providers bị tắt |
| `enabled_providers` | `string[]` | Chỉ enable các providers trong mảng này |
| `provider` | `object` | Cấu hình custom providers (xem bên dưới) |

#### Provider Config

```jsonc
{
  "provider": {
    "provider-name": {
      "whitelist": ["model1", "model2"],    // Chỉ cho phép các models này
      "blacklist": ["model3"],               // Loại bỏ các models này
      "models": {                            // Override model config
        "model-id": {
          // partial model config
        }
      },
      "options": {
        "apiKey": "your-api-key",
        "baseURL": "https://custom-endpoint.com",
        "enterpriseUrl": "https://enterprise.github.com",  // GitHub Enterprise
        "setCacheKey": true,                 // Enable promptCacheKey
        "timeout": 300000                    // Timeout in ms (default: 5 phút), false để tắt
      }
    }
  }
}
```

### Permissions

| Field | Values | Mô tả |
|-------|--------|-------|
| `permission.edit` | `"ask"` \| `"allow"` \| `"deny"` | Quyền chỉnh sửa file |
| `permission.bash` | `"ask"` \| `"allow"` \| `"deny"` hoặc `object` | Quyền chạy bash commands |
| `permission.webfetch` | `"ask"` \| `"allow"` \| `"deny"` | Quyền fetch web |
| `permission.doom_loop` | `"ask"` \| `"allow"` \| `"deny"` | Quyền doom loop |
| `permission.external_directory` | `"ask"` \| `"allow"` \| `"deny"` | Quyền truy cập thư mục ngoài |

#### Bash Permission per Command

```jsonc
{
  "permission": {
    "bash": {
      "npm install": "allow",
      "rm -rf": "deny",
      "git push": "ask"
    }
  }
}
```

### Agent Configuration

```jsonc
{
  "agent": {
    "agent-name": {
      "model": "provider/model",           // Model sử dụng
      "temperature": 0.7,                  // Temperature
      "top_p": 0.9,                        // Top P
      "prompt": "Custom system prompt",    // System prompt
      "tools": {                           // Bật/tắt tools
        "tool-name": true
      },
      "disable": false,                    // Tắt agent
      "description": "Mô tả agent",        // Mô tả khi nào dùng agent
      "mode": "primary",                   // "subagent" | "primary" | "all"
      "color": "#FF5733",                  // Hex color cho agent
      "maxSteps": 100,                     // Số bước tối đa
      "permission": {                      // Override permissions cho agent
        "edit": "allow"
      }
    }
  }
}
```

**Built-in agents:** `plan`, `build`, `general`, `explore`

### MCP Servers

#### Local MCP Server

```jsonc
{
  "mcp": {
    "server-name": {
      "type": "local",
      "command": ["node", "server.js"],
      "environment": {
        "API_KEY": "value"
      },
      "enabled": true,
      "timeout": 5000                      // Timeout in ms (default: 5000)
    }
  }
}
```

#### Remote MCP Server

```jsonc
{
  "mcp": {
    "server-name": {
      "type": "remote",
      "url": "https://mcp-server.com",
      "headers": {
        "Authorization": "Bearer token"
      },
      "enabled": true,
      "timeout": 5000
    }
  }
}
```

### TUI Settings

```jsonc
{
  "tui": {
    "scroll_speed": 1.0,                   // Tốc độ cuộn (min: 0.001)
    "scroll_acceleration": {
      "enabled": true                      // Bật scroll acceleration
    },
    "diff_style": "auto",                  // "auto" | "stacked"
    "copy_on_select": true                 // Tự động copy khi select text (default: true)
  }
}
```

### LSP Configuration

```jsonc
{
  "lsp": false,                            // Tắt hoàn toàn LSP
  // hoặc
  "lsp": {
    "server-id": {
      "disabled": true                     // Tắt server cụ thể
    },
    "custom-server": {
      "command": ["typescript-language-server", "--stdio"],
      "extensions": [".ts", ".tsx"],       // Bắt buộc cho custom servers
      "disabled": false,
      "env": {
        "NODE_ENV": "development"
      },
      "initialization": {
        // LSP initialization options
      }
    }
  }
}
```

### Formatter Configuration

```jsonc
{
  "formatter": false,                      // Tắt hoàn toàn formatter
  // hoặc
  "formatter": {
    "formatter-name": {
      "disabled": false,
      "command": ["prettier", "--write"],
      "environment": {},
      "extensions": [".ts", ".js"]
    }
  }
}
```

### Commands

```jsonc
{
  "command": {
    "command-name": {
      "template": "Command template với {{variables}}",
      "description": "Mô tả command",
      "agent": "agent-name",               // Agent thực thi
      "model": "provider/model",           // Model sử dụng
      "subtask": false                     // Chạy như subtask
    }
  }
}
```

### Các config khác

| Field | Type | Mô tả |
|-------|------|-------|
| `tools` | `Record<string, boolean>` | Bật/tắt tools cụ thể |
| `plugin` | `string[]` | Mảng plugins |
| `instructions` | `string[]` | Files/patterns instruction thêm |
| `watcher.ignore` | `string[]` | Patterns file watcher bỏ qua |
| `snapshot` | `boolean` | Bật snapshots |
| `layout` | `"auto"` \| `"stretch"` | **Deprecated** - Luôn dùng stretch |

### Enterprise

```jsonc
{
  "enterprise": {
    "url": "https://enterprise.example.com"
  }
}
```

### Environment Variables (Flags)

Các flags chỉ có thể cấu hình qua environment variable, chưa hỗ trợ trong JSON config:

| Variable | Mô tả |
|----------|-------|
| `OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT=1` | Tắt auto copy khi select text |
| `OPENCODE_DISABLE_AUTOUPDATE=1` | Tắt auto update |
| `OPENCODE_DISABLE_PRUNE=1` | Tắt auto prune sessions |
| `OPENCODE_DISABLE_DEFAULT_PLUGINS=1` | Tắt default plugins |
| `OPENCODE_DISABLE_LSP_DOWNLOAD=1` | Tắt auto download LSP servers |
| `OPENCODE_DISABLE_AUTOCOMPACT=1` | Tắt auto compact sessions |
| `OPENCODE_ENABLE_EXPERIMENTAL_MODELS=1` | Bật experimental models |
| `OPENCODE_EXPERIMENTAL=1` | Bật tất cả experimental features |
| `OPENCODE_EXPERIMENTAL_WATCHER=1` | Bật experimental file watcher |
| `OPENCODE_EXPERIMENTAL_BASH_MAX_OUTPUT_LENGTH=N` | Giới hạn output bash (bytes) |
| `OPENCODE_CONFIG=/path/to/config.json` | Custom config file path |
| `OPENCODE_CONFIG_DIR=/path/to/dir` | Custom config directory |
| `OPENCODE_PERMISSION='{"edit":"allow"}'` | Override permissions (JSON) |

---

### Experimental Features (JSON Config)

```jsonc
{
  "experimental": {
    "hook": {
      "file_edited": {
        "*.ts": [
          {
            "command": ["prettier", "--write"],
            "environment": {}
          }
        ]
      },
      "session_completed": [
        {
          "command": ["notify-send", "Session done!"],
          "environment": {}
        }
      ]
    },
    "chatMaxRetries": 3,                   // Số lần retry khi chat fail
    "disable_paste_summary": false,        // Tắt paste summary
    "batch_tool": false,                   // Bật batch tool
    "openTelemetry": false,                // Bật OpenTelemetry
    "primary_tools": ["tool1", "tool2"]    // Tools chỉ cho primary agents
  }
}
```

---

## Storage & Cache Locations

OpenCode sử dụng [XDG Base Directory](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html) để lưu trữ dữ liệu.

### Các thư mục lưu trữ

| Thư mục | Đường dẫn mặc định | Mô tả |
|---------|-------------------|-------|
| Data | `~/.local/share/opencode/` | Dữ liệu chính (storage, bin) |
| Storage | `~/.local/share/opencode/storage/` | Sessions, messages, parts |
| Logs | `~/.local/share/opencode/log/` | Log files |
| Cache | `~/.cache/opencode/` | Cache (LSP, parsers, etc.) |
| Config | `~/.config/opencode/` | Config files |
| State | `~/.local/state/opencode/` | Runtime state |

### Xóa cache và dữ liệu

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

### Log files

- Log files được lưu với format: `YYYY-MM-DDTHHMMSS.log`
- OpenCode tự động giữ lại 10 log files gần nhất
- Dev mode sử dụng file `dev.log`

---

## File Config

Config được load theo thứ tự (merge từ trên xuống):

1. `~/.config/opencode/opencode.jsonc` (hoặc `.json`)
2. `.opencode/opencode.jsonc` trong project (tìm từ thư mục hiện tại lên root)
3. `OPENCODE_CONFIG` environment variable
4. `OPENCODE_CONFIG_CONTENT` environment variable

### Biến môi trường trong config

```jsonc
{
  "provider": {
    "openai": {
      "options": {
        "apiKey": "{env:OPENAI_API_KEY}"   // Lấy từ env var
      }
    }
  }
}
```

### File reference trong config

```jsonc
{
  "agent": {
    "custom": {
      "prompt": "{file:./prompts/custom.md}"  // Load từ file
    }
  }
}
```

---

## Ví dụ Config đầy đủ

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "theme": "dracula",
  "model": "anthropic/claude-sonnet-4-20250514",
  "small_model": "anthropic/claude-3-haiku-20240307",
  "username": "developer",
  
  "share": "manual",
  "autoupdate": "notify",
  
  "keybinds": {
    "leader": "ctrl+x",
    "session_new": "<leader>n"
  },
  
  "tui": {
    "scroll_speed": 1.5,
    "diff_style": "auto"
  },
  
  "permission": {
    "edit": "allow",
    "bash": "ask",
    "webfetch": "ask"
  },
  
  "agent": {
    "build": {
      "model": "anthropic/claude-sonnet-4-20250514",
      "maxSteps": 50
    }
  },
  
  "provider": {
    "openai": {
      "options": {
        "apiKey": "{env:OPENAI_API_KEY}"
      }
    }
  },
  
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": ["npx", "@modelcontextprotocol/server-filesystem"],
      "enabled": true
    }
  },
  
  "tools": {
    "dangerous_tool": false
  }
}
```
