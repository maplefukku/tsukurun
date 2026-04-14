"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl"
    >
      <Link href="/" className="flex items-center gap-2">
        <Sparkles className="size-5 text-foreground" />
        <span className="text-base font-semibold tracking-tight">つくるん</span>
      </Link>
      <Button variant="ghost" size="sm" className="rounded-full">
        ログイン
      </Button>
    </motion.header>
  );
}
