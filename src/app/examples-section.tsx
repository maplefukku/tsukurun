"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { templates } from "@/lib/templates/registry";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export function ExamplesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-64px" });
  const router = useRouter();

  return (
    <section ref={ref} className="pb-24">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, ease }}
        className="mb-6 text-center text-sm font-medium text-muted-foreground"
      >
        テンプレートから作る
      </motion.h2>

      <div className="-mx-4 overflow-x-auto px-4 scrollbar-none">
        <div className="flex gap-3" style={{ width: "max-content" }}>
          {templates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, x: 24 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              className="w-56 shrink-0"
            >
              <Card
                className="h-full cursor-pointer rounded-2xl border-border/50 shadow-sm transition-shadow hover:shadow-md dark:bg-card"
                onClick={() => router.push("/create")}
              >
                <CardContent className="flex items-start gap-3 p-6">
                  <span
                    className="text-2xl"
                    role="img"
                    aria-label={template.name}
                  >
                    {template.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">{template.name}</p>
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
