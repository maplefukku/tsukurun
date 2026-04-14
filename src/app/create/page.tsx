"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTemplateById } from "@/lib/templates/registry";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  templateId?: string;
}

// ---------------------------------------------------------------------------
// Animation config
// ---------------------------------------------------------------------------

const appleEasing: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const messageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: appleEasing },
  },
};

const templateCardVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 28 },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const INITIAL_MESSAGE: Message = {
  id: "init",
  role: "assistant",
  content: "こんにちは！最近ハマってることとかある？何でもいいよ 😊",
};

// ---------------------------------------------------------------------------
// Sub-component: TypingIndicator
// ---------------------------------------------------------------------------

function TypingIndicator() {
  return (
    <motion.div
      className="flex items-start max-w-[80%]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.25, ease: appleEasing }}
    >
      <div className="bg-card rounded-2xl px-5 py-3.5 shadow-sm ring-1 ring-foreground/5 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block size-2 rounded-full bg-muted-foreground/50"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: appleEasing,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: TemplateSuggestionCard
// ---------------------------------------------------------------------------

function TemplateSuggestionCard({ templateId }: { templateId: string }) {
  const router = useRouter();
  const template = getTemplateById(templateId);

  if (!template) return null;

  return (
    <motion.div
      variants={templateCardVariants}
      initial="hidden"
      animate="visible"
      className="mt-3 max-w-[80%]"
    >
      <Card className="rounded-2xl shadow-sm border-0 ring-1 ring-foreground/10">
        <CardContent className="flex items-center gap-4 p-4">
          <span
            className="text-3xl shrink-0 leading-none"
            role="img"
            aria-label={template.name}
          >
            {template.icon}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-foreground leading-snug">
              {template.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed truncate">
              {template.description}
            </p>
          </div>
          <Button
            className="shrink-0 h-10 rounded-full px-4 text-xs font-medium"
            onClick={() => router.push(`/preview?templateId=${templateId}`)}
          >
            これにする！
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: MessageBubble
// ---------------------------------------------------------------------------

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      layout
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card shadow-sm ring-1 ring-foreground/5 text-foreground"
        }`}
      >
        {message.content}
      </div>

      {!isUser && message.templateId && (
        <TemplateSuggestionCard templateId={message.templateId} />
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function CreatePage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ---- Auto-scroll on new messages or loading change ----
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ---- Auto-resize textarea ----
  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
    },
    [],
  );

  // ---- Send message ----
  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: uid(),
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const assistantId = uid();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("Network error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";
      let assistantTemplateId: string | undefined;

      // Insert an empty assistant message to stream into
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith("data: ")) continue;

          const payload = trimmedLine.slice(6);

          if (payload === "[DONE]") {
            setIsLoading(false);
            return;
          }

          try {
            const data = JSON.parse(payload) as
              | { type: "text"; content: string }
              | { type: "template"; templateId: string };

            if (data.type === "text") {
              assistantContent += data.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: assistantContent }
                    : m,
                ),
              );
            } else if (data.type === "template") {
              assistantTemplateId = data.templateId;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, templateId: assistantTemplateId }
                    : m,
                ),
              );
            }
          } catch {
            // Ignore malformed JSON chunks
          }
        }
      }

      // Stream ended without [DONE]
      setIsLoading(false);
    } catch {
      // Remove the partial assistant message, add error message
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== assistantId),
        {
          id: uid(),
          role: "assistant" as const,
          content:
            "ごめんね、ちょっとエラーが起きちゃった。もう一度話しかけてみて！",
        },
      ]);
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  // ---- Enter to send (Shift+Enter for new line) ----
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div className="flex flex-col h-dvh bg-background">
      {/* ----------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ----------------------------------------------------------------- */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: appleEasing }}
        className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 h-14 shrink-0"
      >
        <Link href="/" aria-label="戻る">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <h1 className="text-base font-semibold tracking-tight">つくるん</h1>
      </motion.header>

      {/* ----------------------------------------------------------------- */}
      {/* Messages                                                          */}
      {/* ----------------------------------------------------------------- */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-4 p-6 pb-4 max-w-lg mx-auto">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>

          <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>

          <div ref={scrollEndRef} aria-hidden="true" />
        </div>
      </ScrollArea>

      {/* ----------------------------------------------------------------- */}
      {/* Input area                                                        */}
      {/* ----------------------------------------------------------------- */}
      <div className="sticky bottom-0 z-30 shrink-0 border-t border-border/50 bg-background/80 backdrop-blur-xl p-4">
        <div className="flex items-end gap-3 max-w-lg mx-auto">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="なんでも聞いてね..."
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-xl border border-input bg-transparent px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
            style={{ maxHeight: 128 }}
          />
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="size-12 shrink-0 rounded-full p-0"
            aria-label="送信"
          >
            <ArrowUp className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
