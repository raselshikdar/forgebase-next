import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

interface SqlFile {
  name: string
  path: string
  order: number
}

const sqlFiles: SqlFile[] = [
  { name: "001-create-tables.sql", path: "./scripts/001-create-tables.sql", order: 1 },
  { name: "002-enable-rls.sql", path: "./scripts/002-enable-rls.sql", order: 2 },
  { name: "003-create-functions.sql", path: "./scripts/003-create-functions.sql", order: 3 },
  { name: "001a-add-missing-blog-columns.sql", path: "./scripts/001a-add-missing-blog-columns.sql", order: 4 },
  {
    name: "002a-create-blog-interactions-tables.sql",
    path: "./scripts/002a-create-blog-interactions-tables.sql",
    order: 5,
  },
  {
    name: "003a-update-blog-interaction-counts.sql",
    path: "./scripts/003a-update-blog-interaction-counts.sql",
    order: 6,
  },
  { name: "004a-blog-rls-policies.sql", path: "./scripts/004a-blog-rls-policies.sql", order: 7 },
  {
    name: "005b-create-contact-messages-table.sql",
    path: "./scripts/005b-create-contact-messages-table.sql",
    order: 8,
  },
  { name: "006a-create-comment-replies-table.sql", path: "./scripts/006a-create-comment-replies-table.sql", order: 9 },
  { name: "004-setup-storage.sql", path: "./scripts/004-setup-storage.sql", order: 10 },
  { name: "004-seed-data.sql", path: "./scripts/004-seed-data.sql", order: 11 },
]

async function executeSqlFile(filePath: string, fileName: string): Promise<void> {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${fileName} - file not found`)
      return
    }

    const sql = fs.readFileSync(filePath, "utf-8")
    console.log(`\n📝 Executing ${fileName}...`)

    // Split by semicolon but be careful with functions that have semicolons inside
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"))

    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc("execute_sql", { sql: statement })
        if (error) {
          console.error(`Error in ${fileName}:`, error)
          // Continue with next statement instead of stopping
        }
      }
    }

    console.log(`✅ ${fileName} completed`)
  } catch (error) {
    console.error(`❌ Error executing ${fileName}:`, error)
  }
}

async function setupDatabase(): Promise<void> {
  console.log("🚀 Starting database setup...\n")

  // Sort by order
  sqlFiles.sort((a, b) => a.order - b.order)

  for (const file of sqlFiles) {
    await executeSqlFile(file.path, file.name)
  }

  console.log("\n✨ Database setup completed!")
}

setupDatabase().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
