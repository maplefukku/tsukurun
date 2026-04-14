import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { templateId, config } = await request.json();

    if (!templateId) {
      return NextResponse.json(
        { error: "テンプレートIDが必要です" },
        { status: 400 }
      );
    }

    // TODO: Supabase integration for persisting published sites
    const siteId = crypto.randomUUID().slice(0, 8);
    const url = `https://tsukurun.vercel.app/s/${siteId}`;

    return NextResponse.json({ url, siteId });
  } catch {
    return NextResponse.json(
      { error: "公開に失敗しました" },
      { status: 500 }
    );
  }
}
