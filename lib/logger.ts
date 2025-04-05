import fs from "fs"
import path from "path"

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), "logs")
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

const logFilePath = path.join(logsDir, "app.log")

type LogLevel = "info" | "warn" | "error"

export function logToFile(level: LogLevel, message: string, data?: any): void {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level,
    message,
    data: data || {},
  }

  fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + "\n", { encoding: "utf8" })
}

export const logger = {
  info: (message: string, data?: any) => logToFile("info", message, data),
  warn: (message: string, data?: any) => logToFile("warn", message, data),
  error: (message: string, data?: any) => logToFile("error", message, data),
}

