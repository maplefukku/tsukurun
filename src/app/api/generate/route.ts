import { NextRequest, NextResponse } from "next/server";
import { createGlmClient, GLM_MODEL } from "@/lib/glm/client";
import { getTemplateById } from "@/lib/templates/registry";

function extractPlaceholders(htmlTemplate: string): string[] {
  const matches = htmlTemplate.match(/\{\{(\w+)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(2, -2)))];
}

export async function POST(request: NextRequest) {
  let body: { templateId?: string; config?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストの形式が正しくないよ" },
      { status: 400 },
    );
  }

  const { templateId, config } = body;

  if (!templateId) {
    return NextResponse.json(
      { error: "テンプレートIDが必要だよ" },
      { status: 400 },
    );
  }

  const template = getTemplateById(templateId);
  if (!template) {
    return NextResponse.json(
      { error: "テンプレートが見つからないよ" },
      { status: 404 },
    );
  }

  const placeholders = extractPlaceholders(template.htmlTemplate);

  if (placeholders.length === 0) {
    return NextResponse.json({ html: template.htmlTemplate });
  }

  const client = createGlmClient();

  const prompt = `あなたはHTMLテンプレートの変数を埋めるアシスタントです。
ユーザーの要望をもとに、以下のプレースホルダーに入れる値をJSON形式で返してください。

テンプレート名: ${template.name}
テンプレート説明: ${template.description}
プレースホルダー: ${placeholders.join(", ")}

ユーザーの要望:
${config ?? "デフォルトの内容で作って"}

JSONのみを返してください。マークダウンのコードブロックは不要です。
値にHTMLタグを含めてもOKです（例: リスト項目は <div class="item">...</div> のように）。`;

  try {
    const response = await client.chat.completions.create({
      model: GLM_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "生成に失敗したよ" },
        { status: 500 },
      );
    }

    const cleaned = content.replace(/```(?:json)?\s*/g, "").replace(/```/g, "").trim();
    let values: Record<string, string>;
    try {
      values = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "生成結果の解析に失敗したよ" },
        { status: 500 },
      );
    }

    let html = template.htmlTemplate;
    for (const key of placeholders) {
      const value = values[key] ?? "";
      html = html.replaceAll(`{{${key}}}`, value);
    }

    return NextResponse.json({ html });
  } catch {
    return NextResponse.json(
      { error: "AIサービスとの通信に失敗したよ" },
      { status: 502 },
    );
  }
}
