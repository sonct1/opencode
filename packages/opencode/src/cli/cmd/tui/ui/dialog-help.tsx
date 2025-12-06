import { ScrollBoxRenderable, TextAttributes } from "@opentui/core"
import { useTheme } from "@tui/context/theme"
import { useDialog } from "./dialog"
import { useKeyboard, useTerminalDimensions } from "@opentui/solid"
import { useKeybind } from "@tui/context/keybind"
import { createMemo, createSignal, For, onMount } from "solid-js"

const RoundBorder = {
  topLeft: "╭",
  topRight: "╮",
  bottomLeft: "╰",
  bottomRight: "╯",
  horizontal: "─",
  vertical: "│",
  topT: "┬",
  bottomT: "┴",
  leftT: "├",
  rightT: "┤",
  cross: "┼",
}

type HelpItem = {
  label: string
  key: string
}

type HelpSection = {
  title: string
  icon: string
  items: HelpItem[]
  color: "primary" | "accent" | "success" | "warning" | "info" | "secondary"
}

export function DialogHelp() {
  const dialog = useDialog()
  const { theme } = useTheme()
  const keybind = useKeybind()
  const dimensions = useTerminalDimensions()

  const [zoom, setZoom] = createSignal(0)
  const maxHeight = createMemo(() => {
    const base = Math.floor(dimensions().height * 0.6)
    const adjusted = base + zoom() * 5
    return Math.max(10, Math.min(adjusted, dimensions().height - 4))
  })

  let scroll: ScrollBoxRenderable

  onMount(() => {
    dialog.setSize("large")
  })

  useKeyboard((evt) => {
    if (evt.name === "return" || evt.name === "escape") {
      dialog.clear()
      return
    }
    // Scroll controls
    if (evt.name === "up" || evt.name === "k") {
      scroll?.scrollBy(-1)
      evt.preventDefault()
      return
    }
    if (evt.name === "down" || evt.name === "j") {
      scroll?.scrollBy(1)
      evt.preventDefault()
      return
    }
    if (evt.name === "pageup") {
      scroll?.scrollBy(-10)
      evt.preventDefault()
      return
    }
    if (evt.name === "pagedown") {
      scroll?.scrollBy(10)
      evt.preventDefault()
      return
    }
    if (evt.name === "home" || evt.name === "g") {
      scroll?.scrollTo(0)
      evt.preventDefault()
      return
    }
    if (evt.name === "end" || (evt.shift && evt.name === "G")) {
      scroll?.scrollTo(scroll.scrollHeight)
      evt.preventDefault()
      return
    }
    // Zoom controls
    if (evt.name === "+" || evt.name === "=") {
      setZoom((z) => Math.min(z + 1, 10))
      evt.preventDefault()
      return
    }
    if (evt.name === "-" || evt.name === "_") {
      setZoom((z) => Math.max(z - 1, -5))
      evt.preventDefault()
      return
    }
  })

  const sections: HelpSection[] = [
    {
      title: "Basics",
      icon: "⌨ ",
      color: "primary",
      items: [
        { label: "Send message", key: keybind.print("input_submit") },
        { label: "New line", key: keybind.print("input_newline") },
        { label: "Paste from clipboard", key: keybind.print("input_paste") },
        { label: "Clear input", key: keybind.print("input_clear") },
        { label: "Cancel / Interrupt", key: keybind.print("session_interrupt") },
        { label: "Previous history", key: keybind.print("history_previous") },
        { label: "Next history", key: keybind.print("history_next") },
        { label: "Open external editor", key: keybind.print("editor_open") },
        { label: "Exit app", key: keybind.print("app_exit") },
      ],
    },
    {
      title: "Shortcuts",
      icon: "⚡",
      color: "accent",
      items: [
        { label: "Mention file paths", key: "@" },
        { label: "Slash commands menu", key: "/" },
        { label: "Command palette", key: keybind.print("command_list") },
        { label: "Switch model", key: keybind.print("model_list") },
        { label: "Cycle recent model", key: keybind.print("model_cycle_recent") },
        { label: "Switch agent", key: keybind.print("agent_list") },
        { label: "Cycle agent", key: keybind.print("agent_cycle") },
        { label: "Switch theme", key: keybind.print("theme_list") },
        { label: "View status / MCP", key: keybind.print("status_view") },
      ],
    },
    {
      title: "Navigation",
      icon: "🧭",
      color: "success",
      items: [
        { label: "Page up", key: keybind.print("messages_page_up") },
        { label: "Page down", key: keybind.print("messages_page_down") },
        { label: "Half page up", key: keybind.print("messages_half_page_up") },
        { label: "Half page down", key: keybind.print("messages_half_page_down") },
        { label: "Go to first message", key: keybind.print("messages_first") },
        { label: "Go to last message", key: keybind.print("messages_last") },
        { label: "Previous message", key: keybind.print("messages_previous") },
        { label: "Next message", key: keybind.print("messages_next") },
      ],
    },
    {
      title: "Session",
      icon: "💬",
      color: "warning",
      items: [
        { label: "New session", key: keybind.print("session_new") },
        { label: "Session list", key: keybind.print("session_list") },
        { label: "Session timeline", key: keybind.print("session_timeline") },
        { label: "Undo last message", key: keybind.print("messages_undo") },
        { label: "Redo message", key: keybind.print("messages_redo") },
        { label: "Compact / Summarize", key: keybind.print("session_compact") },
        { label: "Copy message", key: keybind.print("messages_copy") },
        { label: "Export to file", key: keybind.print("session_export") },
      ],
    },
    {
      title: "View",
      icon: "👁 ",
      color: "info",
      items: [
        { label: "Toggle sidebar", key: keybind.print("sidebar_toggle") },
        { label: "Toggle code conceal", key: keybind.print("messages_toggle_conceal") },
        { label: "Toggle bash output", key: keybind.print("bash_output_toggle") },
        { label: "Toggle file content", key: keybind.print("file_content_toggle") },
        { label: "Copy selected text", key: "ctrl+c" },
      ],
    },
  ]

  return (
    <box paddingLeft={1} paddingRight={1} paddingBottom={1}>
      <box flexDirection="row" justifyContent="space-between" paddingLeft={1} paddingRight={1} marginBottom={1}>
        <text attributes={TextAttributes.BOLD} fg={theme.primary}>
          ❓ Help
        </text>
        <text fg={theme.textMuted}>esc/enter to close</text>
      </box>
      <scrollbox
        ref={(r: ScrollBoxRenderable) => {
          scroll = r
          setTimeout(() => r.focus(), 10)
        }}
        maxHeight={maxHeight()}
        scrollbarOptions={{ visible: false }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <box>
          <For each={sections}>
            {(section, index) => (
              <box
                border={["top", "bottom", "left", "right"]}
                customBorderChars={RoundBorder}
                borderColor={theme[section.color]}
                marginTop={index() > 0 ? 1 : 0}
              >
                <box paddingLeft={1} paddingRight={1}>
                  <text attributes={TextAttributes.BOLD} fg={theme[section.color]}>
                    {section.icon} {section.title}
                  </text>
                </box>
                <For each={section.items}>
                  {(item) => (
                    <box flexDirection="row" justifyContent="space-between" paddingLeft={1} paddingRight={1}>
                      <text fg={theme.text}>{item.label}</text>
                      <text fg={theme.accent}>{item.key}</text>
                    </box>
                  )}
                </For>
              </box>
            )}
          </For>
        </box>
      </scrollbox>
      <box flexDirection="row" justifyContent="space-between" paddingLeft={1} paddingRight={1} marginTop={1}>
        <text fg={theme.textMuted}>
          <span style={{ fg: theme.accent }}>↑↓jk</span> scroll{" "}
          <span style={{ fg: theme.accent }}>pgup/dn</span> page{" "}
          <span style={{ fg: theme.accent }}>g/G</span> first/last
        </text>
        <text fg={theme.textMuted}>
          <span style={{ fg: theme.warning }}>+/-</span> zoom
        </text>
      </box>
    </box>
  )
}
