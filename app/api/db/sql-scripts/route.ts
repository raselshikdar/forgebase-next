import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const scriptsDir = path.join(process.cwd(), "scripts")
    const sqlFiles = fs
      .readdirSync(scriptsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort()

    const scripts = sqlFiles.map((file) => {
      const filePath = path.join(scriptsDir, file)
      const content = fs.readFileSync(filePath, "utf-8")
      return {
        name: file,
        content,
        size: content.length,
      }
    })

    return NextResponse.json({
      success: true,
      count: scripts.length,
      scripts,
    })
  } catch (error) {
    console.error("Error reading SQL scripts:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Failed to read SQL scripts: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
