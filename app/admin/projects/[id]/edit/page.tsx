import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProjectForm } from "@/components/admin/project-form"
import type { Project } from "@/lib/types"

interface PageProps {
  params: Promise<{ id: string }>
}

async function getProject(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from("projects").select("*").eq("id", id).single()
  return data as Project | null
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Project</h2>
        <p className="text-muted-foreground">Update your project details</p>
      </div>

      <ProjectForm project={project} />
    </div>
  )
}
