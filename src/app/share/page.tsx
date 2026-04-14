"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink, MessageCircle, ArrowRight } from "lucide-react";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function SharePage() {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://tsukurun.vercel.app/s/abc123";

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className="flex size-16 items-center justify-center rounded-full bg-foreground"
        >
          <Check className="size-8 text-background" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="mt-6 text-2xl font-bold tracking-tight"
        >
          完成！
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
          className="mt-2 text-sm text-muted-foreground"
        >
          あなたのWebツールが公開されたよ
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease }}
          className="mt-8 flex w-full items-center gap-2 rounded-2xl border border-border/50 bg-muted/50 p-4"
        >
          <code className="flex-1 truncate text-left font-mono text-sm">
            {shareUrl}
          </code>
          <Button
            variant="ghost"
            className="size-10 shrink-0 rounded-full p-0"
            onClick={handleCopy}
            aria-label="URLをコピー"
          >
            {copied ? (
              <Check className="size-4 text-foreground" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease }}
          className="mt-6 flex w-full flex-col gap-3"
        >
          <Button
            className="h-12 rounded-full text-sm font-medium shadow-sm hover:shadow-md"
            onClick={() =>
              window.open(
                `https://line.me/R/msg/text/?${encodeURIComponent(shareUrl)}`,
                "_blank"
              )
            }
          >
            <MessageCircle className="mr-1.5 size-4" />
            LINEで送る
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-full border-border/50 text-sm font-medium"
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("つくるんで作ったよ！")}`,
                "_blank"
              )
            }
          >
            <ExternalLink className="mr-1.5 size-4" />
            Xでシェア
          </Button>
          <Button
            variant="ghost"
            className="h-12 rounded-full text-sm font-medium"
            onClick={handleCopy}
          >
            <Copy className="mr-1.5 size-4" />
            リンクをコピー
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8, ease }}
          className="mt-12"
        >
          <p className="mb-3 text-sm text-muted-foreground">
            次はどんなの作る？
          </p>
          <Button
            variant="outline"
            className="h-12 rounded-full border-border/50 px-6 text-sm font-medium"
            render={<Link href="/create" />}
          >
            もう1つ作ってみる
            <ArrowRight className="ml-1.5 size-4" />
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
