import fs from "fs"
import path from "path"
import os from "os"

const HISTORY_FILE = path.join(os.homedir(), ".opencode_shell_history")
const MAX_HISTORY = 1000

let historyCache: string[] | null = null

export function loadHistory(): string[] {
  if (historyCache) return historyCache

  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const content = fs.readFileSync(HISTORY_FILE, "utf-8")
      historyCache = content.split("\n").filter(Boolean)
      return historyCache
    }
  } catch {}

  historyCache = []
  return historyCache
}

export function addToHistory(command: string): void {
  const trimmed = command.trim()
  if (!trimmed) return

  const history = loadHistory()

  const existingIndex = history.indexOf(trimmed)
  if (existingIndex !== -1) {
    history.splice(existingIndex, 1)
  }

  history.unshift(trimmed)

  if (history.length > MAX_HISTORY) {
    history.length = MAX_HISTORY
  }

  historyCache = history

  try {
    fs.writeFileSync(HISTORY_FILE, history.join("\n"), "utf-8")
  } catch {}
}

export function getSuggestion(input: string): string | null {
  if (!input.trim()) return null

  const history = loadHistory()
  const lowerInput = input.toLowerCase()

  for (const cmd of history) {
    if (cmd.toLowerCase().startsWith(lowerInput) && cmd !== input) {
      return cmd.slice(input.length)
    }
  }

  return null
}

export function getMatchingCommands(prefix: string, limit = 10): string[] {
  if (!prefix.trim()) return []

  const history = loadHistory()
  const lowerPrefix = prefix.toLowerCase()
  const matches: string[] = []

  for (const cmd of history) {
    if (cmd.toLowerCase().startsWith(lowerPrefix)) {
      matches.push(cmd)
      if (matches.length >= limit) break
    }
  }

  return matches
}

function expandTilde(filepath: string): string {
  if (filepath.startsWith("~/")) {
    return path.join(os.homedir(), filepath.slice(2))
  }
  if (filepath === "~") {
    return os.homedir()
  }
  return filepath
}

export function getPathCompletion(input: string): string | null {
  const trimmed = input.trimEnd()
  const parts = trimmed.split(/\s+/)
  const lastPart = parts[parts.length - 1] || ""
  
  if (!lastPart) return null

  try {
    const expandedPath = expandTilde(lastPart)
    let dirPath: string
    let prefix: string

    if (lastPart.endsWith("/")) {
      return null
    } else {
      dirPath = path.dirname(expandedPath) || "."
      prefix = path.basename(expandedPath)
    }

    if (!prefix) return null

    const resolvedDir = path.resolve(dirPath)
    
    if (!fs.existsSync(resolvedDir)) return null
    
    const entries = fs.readdirSync(resolvedDir, { withFileTypes: true })
    const matches: { name: string; isDir: boolean }[] = []

    for (const entry of entries) {
      if (entry.name.startsWith(".") && !prefix.startsWith(".")) {
        continue
      }
      if (entry.name.toLowerCase().startsWith(prefix.toLowerCase())) {
        matches.push({ name: entry.name, isDir: entry.isDirectory() })
      }
    }

    if (matches.length === 0) return null

    if (matches.length === 1) {
      const match = matches[0]
      const completion = match.name.slice(prefix.length)
      return completion + (match.isDir ? "/" : " ")
    }

    let common = matches[0].name
    for (let i = 1; i < matches.length; i++) {
      const name = matches[i].name
      let j = 0
      while (j < common.length && j < name.length && common[j].toLowerCase() === name[j].toLowerCase()) {
        j++
      }
      common = common.slice(0, j)
    }

    if (common.length > prefix.length) {
      return common.slice(prefix.length)
    }

    return null
  } catch {
    return null
  }
}
