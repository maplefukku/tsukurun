import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) {
    slug += chars[byte % chars.length];
  }
  return slug;
}

export async function POST(request: NextRequest) {
  try {
    const { templateId, config, generatedHtml } = await request.json();

    if (!templateId) {
      return NextResponse.json(
        { error: "テンプレートIDが必要です" },
        { status: 400 }
      );
    }

    if (!generatedHtml) {
      return NextResponse.json(
        { error: "HTMLが必要です" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const title =
      (config && typeof config === "object" && config.title) || "Untitled";

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        title,
        template_id: templateId,
        config: config || {},
        generated_html: generatedHtml,
        status: "published",
      })
      .select("id")
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "プロジェクトの作成に失敗しました" },
        { status: 500 }
      );
    }

    const slug = generateSlug();

    const { error: siteError } = await supabase
      .from("published_sites")
      .insert({
        project_id: project.id,
        slug,
        html_snapshot: generatedHtml,
      });

    if (siteError) {
      return NextResponse.json(
        { error: "公開に失敗しました" },
        { status: 500 }
      );
    }

    await supabase
      .from("projects")
      .update({ published_slug: slug })
      .eq("id", project.id);

    const url = `https://tsukurun.vercel.app/s/${slug}`;

    return NextResponse.json({ url, slug });
  } catch {
    return NextResponse.json(
      { error: "公開に失敗しました" },
      { status: 500 }
    );
  }
}
