import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import * as path from "path"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function executeSqlScript() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("[v0] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

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

  for (const fileName of sqlFiles) {
    const filePath = path.join(process.cwd(), "scripts", fileName)

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${fileName} - file not found`)
      continue
    }

    try {
      const sql = fs.readFileSync(filePath, "utf-8")
      console.log(`\n📝 Executing ${fileName}...`)

      // Execute as raw query
      const { error } = await supabase.rpc("sql_exec", { sql })

      if (error && error.code !== "42P1" && error.code !== "42701") {
        // 42P1 = relation already exists, 42701 = duplicate function
        // These are expected errors for idempotent scripts
        console.error(`❌ Error in ${fileName}:`, error)
      } else {
        console.log(`✅ ${fileName} completed`)
      }
    } catch (err) {
      console.warn(`⚠️  Warning in ${fileName}:`, err instanceof Error ? err.message : String(err))
    }
  }

  console.log("\n✨ Database setup completed!")
}

executeSqlScript().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
