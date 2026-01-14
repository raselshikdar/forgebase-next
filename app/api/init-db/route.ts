import * as fs from "fs"
import * as path from "path"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })
    }

    // SQL files in execution order
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

    const results: { file: string; status: string; sql?: string; error?: string }[] = []

    for (const fileName of sqlFiles) {
      const filePath = path.join(process.cwd(), "scripts", fileName)

      if (!fs.existsSync(filePath)) {
        results.push({ file: fileName, status: "skipped", error: "File not found" })
        continue
      }

      try {
        const sql = fs.readFileSync(filePath, "utf-8")

        // Clean up SQL for display
        const cleanedSql = sql
          .split("\n")
          .filter((line) => !line.trim().startsWith("--") && line.trim())
          .join("\n")

        results.push({
          file: fileName,
          status: "ready",
          sql: cleanedSql,
        })
      } catch (fileError) {
        results.push({
          file: fileName,
          status: "error",
          error: fileError instanceof Error ? fileError.message : "Unknown error",
        })
      }
    }

    let batchSuccess = false
    try {
      // Concatenate all SQL and attempt to execute via Management API
      const allSql = results
        .filter((r) => r.sql)
        .map((r) => r.sql)
        .join("\n\n")

      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseServiceRoleKey}`,
        },
        body: JSON.stringify({ sql: allSql }),
      })

      if (response.ok) {
        batchSuccess = true
        console.log("[v0] Batch SQL execution successful")
      } else {
        console.log("[v0] Batch execution not available, instructions provided for manual setup")
      }
    } catch (err) {
      console.log("[v0] Batch execution attempt failed, manual setup instructions provided")
    }

    return NextResponse.json(
      {
        success: batchSuccess,
        message: batchSuccess
          ? "Database initialized successfully!"
          : "SQL scripts ready. Please run them in your Supabase Dashboard.",
        scripts: results,
        instructions: {
          automatic: batchSuccess ? "Completed" : "Not available",
          manual: "Visit https://supabase.com/dashboard → SQL Editor → Paste and run each script in order",
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Init DB error:", error)
    return NextResponse.json(
      {
        error: "Failed to prepare database initialization",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
