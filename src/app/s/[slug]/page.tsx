import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: site } = await supabase
    .from("published_sites")
    .select("slug, project_id")
    .eq("slug", slug)
    .single();

  if (!site) {
    return { title: "ページが見つかりません" };
  }

  const { data: project } = await supabase
    .from("projects")
    .select("title")
    .eq("id", site.project_id)
    .single();

  const title = project?.title || "つくるん";

  return {
    title,
    openGraph: {
      title,
      siteName: "つくるん",
      type: "website",
      url: `https://tsukurun.vercel.app/s/${slug}`,
    },
    twitter: {
      card: "summary",
      title,
    },
  };
}

export default async function PublishedSitePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: site } = await supabase
    .from("published_sites")
    .select("html_snapshot")
    .eq("slug", slug)
    .single();

  if (!site) {
    notFound();
  }

  return (
    <iframe
      srcDoc={site.html_snapshot}
      title="Published site"
      className="h-screen w-screen border-0"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
