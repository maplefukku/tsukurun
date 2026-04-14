"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Pencil, Share2 } from "lucide-react";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const loadingSteps = [
  "アイデアを整理してるよ...",
  "デザインを考え中...",
  "コードを書いてるよ...",
  "最終チェック中...",
];

function SkeletonLine({ width, delay }: { width: string; delay: number }) {
  return (
    <motion.div
      className={`h-3 rounded-full bg-muted ${width}`}
      initial={{ opacity: 0.3 }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, delay, ease }}
    />
  );
}

function PreviewContent() {
  const searchParams = useSearchParams();
  const template = searchParams.get("template");
  const [isLoading, setIsLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease }}
            className="flex flex-col items-center"
          >
            <div className="w-full space-y-4 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
              {[0, 1, 2, 3, 4].map((i) => (
                <SkeletonLine
                  key={i}
                  width={i % 2 === 0 ? "w-full" : "w-3/4"}
                  delay={i * 0.15}
                />
              ))}
            </div>
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease }}
              className="mt-6 text-sm text-muted-foreground"
            >
              {loadingSteps[stepIndex]}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex flex-col items-center"
          >
            <div className="w-full overflow-hidden rounded-2xl border border-border/50 shadow-sm">
              <div className="flex h-8 items-center gap-1.5 border-b border-border/50 bg-muted/50 px-3">
                <span className="size-2.5 rounded-full bg-muted-foreground/20" />
                <span className="size-2.5 rounded-full bg-muted-foreground/20" />
                <span className="size-2.5 rounded-full bg-muted-foreground/20" />
              </div>
              <iframe
                src="about:blank"
                title="プレビュー"
                className="h-80 w-full bg-background"
                sandbox="allow-scripts"
              />
            </div>

            <div className="mt-8 flex w-full gap-3">
              <Button
                className="h-12 flex-1 rounded-full text-sm font-medium shadow-sm hover:shadow-md"
                render={<Link href="/share" />}
              >
                <Share2 className="mr-1.5 size-4" />
                友達にシェアする
              </Button>
              <Button
                variant="outline"
                className="h-12 flex-1 rounded-full border-border/50 text-sm font-medium"
                render={<Link href="/create" />}
              >
                <Pencil className="mr-1.5 size-4" />
                もう少し変えたい
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <div className="min-h-dvh">
      <Header />
      <Suspense>
        <PreviewContent />
      </Suspense>
    </div>
  );
}
