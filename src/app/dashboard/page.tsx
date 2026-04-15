import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { ProjectList } from "./project-list";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, status, published_slug, template_id, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <ProjectList projects={projects ?? []} />
      </main>
    </div>
  );
}
