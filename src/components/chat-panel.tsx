"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "@/components/message-bubble";
import { SuggestionCard } from "@/components/suggestion-card";
import { TypingIndicator } from "@/components/typing-indicator";
import type { Message, Suggestion } from "@/lib/types";

const INITIAL_MESSAGE: Message = {
  id: "initial",
  role: "assistant",
  content: "こんにちは！最近ハマってることとかある？何でもいいよ",
};

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setSuggestions([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      const assistantId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === "text") {
                  assistantText += parsed.content;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, content: assistantText }
                        : m
                    )
                  );
                } else if (parsed.type === "suggestions") {
                  setSuggestions(parsed.suggestions);
                }
              } catch {
                // skip malformed JSON
              }
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "ごめんね、ちょっとエラーが起きちゃった。もう一回試してみて！",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSuggestionSelect(suggestion: Suggestion) {
    window.location.href = `/preview?template=${encodeURIComponent(suggestion.id)}`;
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-2">
            <div className="rounded-2xl bg-muted px-4 py-3">
              <TypingIndicator />
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-3 pt-2">
            {suggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onSelect={handleSuggestionSelect}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border/50 bg-background/80 p-4 backdrop-blur-xl">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力..."
            className="h-12 flex-1 rounded-xl border border-border/50 bg-muted/50 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            disabled={isLoading}
          />
          <Button
            className="size-12 shrink-0 rounded-full p-0"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="送信"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
