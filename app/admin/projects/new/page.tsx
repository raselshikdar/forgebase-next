import { ProjectForm } from "@/components/admin/project-form"

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add New Project</h2>
        <p className="text-muted-foreground">Showcase your latest work in your portfolio</p>
      </div>

      <ProjectForm />
    </div>
  )
}
