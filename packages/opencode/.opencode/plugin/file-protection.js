export const FileProtection = async ({ project, client, $, directory, worktree }) => {
  const protectedFiles = [
    ".env",               // Biến môi trường (quan trọng nhất)
    "id_rsa",             // SSH Private Key (cũ)
    "id_ed25519",         // SSH Private Key (mới)
    ".pem",               // SSL/TLS Keys
    ".key",               // SSL/TLS Keys
    ".npmrc",             // Token upload package
    ".pypirc",            // Token upload package
    "credentials.json",   // Google/AWS Cloud credentials
    ".bash_history",      // Lịch sử lệnh terminal
    ".zsh_history",       // Lịch sử lệnh terminal
    "/etc/passwd",        // File hệ thống Linux
    "/etc/shadow",        // File hệ thống Linux
  ]

  // Các pattern cho phép đọc (example/sample files)
  const allowedPatterns = [
    ".example",           // .env.example, credentials.example.json
    ".sample",            // .env.sample, config.sample.json
    ".template",          // .env.template
    "-example",           // credentials-example.json
    "-sample",            // config-sample.json
    "-template",          // config-template.json
    "_example",           // credentials_example.json
    "_sample",            // config_sample.json
    "_template",          // config_template.json
  ]

  // Kiểm tra xem file có phải là example/sample không
  const isExampleFile = (filePath) => {
    const lowerPath = filePath.toLowerCase()
    return allowedPatterns.some(pattern => lowerPath.includes(pattern))
  }

  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "read") {
        const filePath = output.args.filePath
        
        // Cho phép đọc nếu là file example/sample
        if (isExampleFile(filePath)) {
          return // Cho phép đọc
        }
        
        const isProtected = protectedFiles.some(
          (protectedFile) =>
            filePath.includes(protectedFile) || filePath.endsWith(protectedFile)
        )
        if (isProtected) {
          throw new Error(`Access denied: Cannot read protected file "${filePath}"`)
        }
      }
    },
  }
}