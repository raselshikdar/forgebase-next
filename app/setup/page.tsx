"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2, ExternalLink, Database, Shield, Zap } from "lucide-react"
import Link from "next/link"

const sqlScripts = [
  {
    name: "007-complete-schema-setup.sql",
    description: "Create all core tables (profiles, blogs, projects, products, contact_messages)",
    icon: Database,
  },
  {
    name: "008-enable-all-rls.sql",
    description: "Enable Row Level Security with proper policies",
    icon: Shield,
  },
  {
    name: "009-setup-storage-buckets.sql",
    description: "Setup Supabase storage buckets for images",
    icon: Zap,
  },
  {
    name: "010-seed-sample-content.sql",
    description: "Optional: Seed sample blog posts and projects",
    icon: Database,
  },
]

export default function SetupPage() {
  const [completedScripts, setCompletedScripts] = useState<string[]>([])
  const [isAutoSetupRunning, setIsAutoSetupRunning] = useState(false)
  const [autoSetupResult, setAutoSetupResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleScriptComplete = (scriptName: string) => {
    setCompletedScripts((prev) =>
      prev.includes(scriptName) ? prev.filter((s) => s !== scriptName) : [...prev, scriptName],
    )
  }

  const handleAutoSetup = async () => {
    setIsAutoSetupRunning(true)
    setAutoSetupResult(null)

    try {
      const response = await fetch("/api/db/init", { method: "POST" })
      const data = await response.json()

      if (response.ok && data.success) {
        setAutoSetupResult({ success: true, message: "Database initialized successfully!" })
        setCompletedScripts(sqlScripts.map((s) => s.name))
      } else {
        setAutoSetupResult({
          success: false,
          message: data.message || "Automatic setup not available. Follow manual setup below.",
        })
      }
    } catch (error) {
      setAutoSetupResult({ success: false, message: error instanceof Error ? error.message : "Setup failed" })
    } finally {
      setIsAutoSetupRunning(false)
    }
  }

  const allComplete = completedScripts.length === sqlScripts.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Database className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Database Setup</h1>
          <p className="text-muted-foreground">Initialize your Forgebase database in minutes</p>
        </div>

        {/* Auto Setup Card */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Automatically initialize your database with all required tables, security policies, and storage buckets.
            </p>

            {autoSetupResult && (
              <Alert
                className={
                  autoSetupResult.success
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : "border-amber-500/50 bg-amber-500/10"
                }
              >
                {autoSetupResult.success ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                )}
                <AlertDescription
                  className={
                    autoSetupResult.success
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-amber-700 dark:text-amber-300"
                  }
                >
                  {autoSetupResult.message}
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={handleAutoSetup} disabled={isAutoSetupRunning} className="w-full" size="lg">
              {isAutoSetupRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                "Run Automatic Setup"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Manual Setup Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Manual Setup</h2>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              Open Supabase <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Run these SQL scripts in order via the Supabase SQL Editor:
          </p>

          <div className="space-y-3">
            {sqlScripts.map((script, index) => {
              const Icon = script.icon
              const isComplete = completedScripts.includes(script.name)

              return (
                <Card
                  key={script.name}
                  className={`transition-all cursor-pointer ${
                    isComplete ? "border-emerald-500/50 bg-emerald-500/5" : "hover:border-primary/50"
                  }`}
                  onClick={() => handleScriptComplete(script.name)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          isComplete ? "bg-emerald-500/20" : "bg-muted"
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm font-medium truncate">{script.name}</p>
                        <p className="text-xs text-muted-foreground">{script.description}</p>
                      </div>
                      <Icon
                        className={`h-4 w-4 flex-shrink-0 ${isComplete ? "text-emerald-600" : "text-muted-foreground"}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Continue Card */}
        <Card className="bg-card/50">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                {allComplete || autoSetupResult?.success ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-medium">
                    <CheckCircle2 className="h-5 w-5" />
                    Setup complete!
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {sqlScripts.length - completedScripts.length} of {sqlScripts.length} scripts remaining
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Go to Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/">Go to Homepage</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
