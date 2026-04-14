"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Suggestion } from "@/lib/types";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export function SuggestionCard({
  suggestion,
  onSelect,
}: {
  suggestion: Suggestion;
  onSelect: (suggestion: Suggestion) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease }}
      className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm"
    >
      <p className="font-medium">{suggestion.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {suggestion.description}
      </p>
      <Button
        className="mt-3 h-10 rounded-full px-5 text-sm"
        onClick={() => onSelect(suggestion)}
      >
        これにする！
      </Button>
    </motion.div>
  );
}
