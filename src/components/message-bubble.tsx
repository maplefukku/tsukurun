"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className={cn("flex gap-2", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {!isUser && (
        <Avatar size="sm">
          <AvatarFallback>
            <Sparkles className="size-3" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-foreground text-background"
            : "bg-muted text-foreground"
        )}
      >
        {message.content}
      </div>
    </motion.div>
  );
}
