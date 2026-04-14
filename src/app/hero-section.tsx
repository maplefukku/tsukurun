"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export function HeroSection() {
  return (
    <section className="flex flex-col items-center pb-16 pt-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted px-3 py-1 text-xs text-muted-foreground">
          <Zap className="size-3" />
          30分で完成。コード不要。
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease }}
        className="text-3xl font-bold tracking-tight sm:text-4xl"
      >
        話すだけで、
        <br />
        Webツールができる。
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease }}
        className="mt-4 text-base text-muted-foreground"
      >
        「何を作るか」はAIと一緒に考えよう
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease }}
        className="mt-8"
      >
        <Button
          className="h-12 rounded-full px-8 text-base font-medium shadow-sm hover:shadow-md"
          render={<Link href="/create" />}
        >
          作ってみる
          <ArrowRight className="ml-1 size-4" />
        </Button>
      </motion.div>
    </section>
  );
}
