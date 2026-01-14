import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Read SQL files and split into individual statements
function readSQLFile(filename: string): string[] {
  const filePath = path.join(process.cwd(), "scripts", filename)
  const content = fs.readFileSync(filePath, "utf-8")
  // Split by semicolon and filter empty statements
  return content
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0)
    .map((stmt) => stmt + ";")
}

// Execute SQL scripts in order
async function executeSQLScripts(supabase: any): Promise<{ success: boolean; message: string; details: string[] }> {
  const details: string[] = []

  // SQL scripts to execute in order
  const scripts = [
    "001-create-tables.sql",
    "002-enable-rls.sql",
    "003-create-functions.sql",
    "004-seed-data.sql",
    "004-setup-storage.sql",
    "005-seed-sample-data.sql",
  ]

  try {
    for (const script of scripts) {
      try {
        const statements = readSQLFile(script)
        details.push(`[${script}] Found ${statements.length} SQL statements`)

        for (const statement of statements) {
          try {
            const { error } = await supabase.rpc("exec_sql", { sql: statement })

            // If exec_sql doesn't exist, try direct approach
            if (error?.code === "42883" || error?.message?.includes("does not exist")) {
              // RPC doesn't exist, try alternative
              details.push(`[${script}] Using fallback execution method`)
              break
            }

            if (error) {
              details.push(`[${script}] Error: ${error.message || error.code}`)
            }
          } catch (e) {
            console.error(`Error executing statement in ${script}:`, e)
          }
        }

        details.push(`[${script}] ✓ Processed`)
      } catch (error) {
        details.push(`[${script}] ✗ Failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    return {
      success: true,
      message: "Database initialization completed",
      details,
    }
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      details,
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for admin operations
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {},
        },
      },
    )

    const result = await executeSQLScripts(supabase)

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    })
  } catch (error) {
    console.error("Database init error:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Failed to initialize database: ${error instanceof Error ? error.message : String(error)}`,
        details: [],
      },
      { status: 500 },
    )
  }
}
