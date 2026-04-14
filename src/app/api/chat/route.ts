import { NextRequest } from "next/server";
import { createGlmClient, GLM_MODEL } from "@/lib/glm/client";

const SYSTEM_PROMPT = `あなたは「つくるん」のアシスタントです。ユーザーと雑談しながら、ユーザーが作りたいWebツールのアイデアを引き出してください。

ルール:
- フレンドリーでカジュアルな口調
- ユーザーの興味を深堀りして、具体的なツールのアイデアを提案する
- 3-4往復したら、具体的なツール提案を出す
- 提案するときは、JSON形式で提案を含める（通常のテキスト内に埋め込む）

提案を出すときは、メッセージの最後に以下の形式で：
[SUGGESTIONS]
[{"id":"template-1","title":"ツール名","description":"説明"}]
[/SUGGESTIONS]`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages)) {
      return new Response("Invalid request", { status: 400 });
    }

    const glm = createGlmClient();

    const stream = await glm.chat.completions.create({
      model: GLM_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      stream: true,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        let fullContent = "";

        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content ?? "";
            if (delta) {
              fullContent += delta;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "text", content: delta })}\n\n`)
              );
            }
          }

          const sugMatch = fullContent.match(
            /\[SUGGESTIONS\]\s*([\s\S]*?)\s*\[\/SUGGESTIONS\]/
          );
          if (sugMatch) {
            try {
              const suggestions = JSON.parse(sugMatch[1]);
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "suggestions", suggestions })}\n\n`
                )
              );
            } catch {
              // skip malformed suggestions
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (error) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", message: "Stream error" })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
