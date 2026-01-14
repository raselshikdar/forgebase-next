import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import * as path from "path"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST() {
  try {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Define SQL files in execution order
    const sqlFiles = [
      "001-create-tables.sql",
      "002-enable-rls.sql",
      "003-create-functions.sql",
      "001a-add-missing-blog-columns.sql",
      "002a-create-blog-interactions-tables.sql",
      "003a-update-blog-interaction-counts.sql",
      "004a-blog-rls-policies.sql",
      "005b-create-contact-messages-table.sql",
      "006a-create-comment-replies-table.sql",
      "004-setup-storage.sql",
      "004-seed-data.sql",
    ]

    const results: { file: string; status: string; error?: string }[] = []

    for (const fileName of sqlFiles) {
      const filePath = path.join(process.cwd(), "scripts", fileName)

      if (!fs.existsSync(filePath)) {
        results.push({ file: fileName, status: "skipped", error: "File not found" })
        continue
      }

      const sql = fs.readFileSync(filePath, "utf-8")

      // Split statements by semicolon, handling comments
      const statements = sql
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      let statementCount = 0
      let errorOccurred = false

      for (const statement of statements) {
        try {
          const { error } = await supabase.from("_meta").select("*").limit(1)
          // Just verify connection, execute raw SQL via direct query
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/execute`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${supabaseServiceRoleKey}`,
            },
            body: JSON.stringify({ sql: statement }),
          })

          if (response.ok) {
            statementCount++
          } else {
            const errorData = await response.json()
            console.error(`Error in ${fileName}:`, errorData)
            errorOccurred = true
          }
        } catch (err) {
          console.error(`Error executing statement in ${fileName}:`, err)
          errorOccurred = true
        }
      }

      results.push({
        file: fileName,
        status: errorOccurred ? "partial" : "completed",
        error: errorOccurred ? "Some statements may have failed" : undefined,
      })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Database setup initiated",
        results,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      {
        error: "Database setup failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
