"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const templates = [
  {
    title: "メニューボード",
    description: "お店のメニューをおしゃれに表示",
    emoji: "🍽",
  },
  {
    title: "やることリスト",
    description: "タスクをサクサク管理",
    emoji: "✅",
  },
  {
    title: "カウントダウン",
    description: "イベントまでの残り時間を表示",
    emoji: "⏱",
  },
  {
    title: "投票アンケート",
    description: "みんなの意見をリアルタイム集計",
    emoji: "📊",
  },
  {
    title: "プロフィールカード",
    description: "自己紹介ページをさっと作成",
    emoji: "👤",
  },
  {
    title: "割り勘カリキュレーター",
    description: "飲み会の会計をサクッと計算",
    emoji: "🧮",
  },
  {
    title: "読書メモ",
    description: "読んだ本の感想をまとめる",
    emoji: "📚",
  },
];

export function ExamplesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-64px" });

  return (
    <section ref={ref} className="pb-24">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, ease }}
        className="mb-6 text-center text-sm font-medium text-muted-foreground"
      >
        みんなが作ったもの
      </motion.h2>

      <div className="-mx-4 overflow-x-auto px-4 scrollbar-none">
        <div className="flex gap-3" style={{ width: "max-content" }}>
          {templates.map((template, i) => (
            <motion.div
              key={template.title}
              initial={{ opacity: 0, x: 24 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              className="w-56 shrink-0"
            >
              <Card className="h-full rounded-2xl border-border/50 shadow-sm transition-shadow hover:shadow-md dark:bg-card">
                <CardContent className="flex items-start gap-3 p-6">
                  <span
                    className="text-2xl"
                    role="img"
                    aria-label={template.title}
                  >
                    {template.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">{template.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
