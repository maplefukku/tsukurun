"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ExternalLink, FolderOpen } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  title: string;
  status: string;
  published_slug: string | null;
  template_id: string | null;
  created_at: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-8 flex items-center justify-between"
      >
        <h1 className="text-xl font-semibold tracking-tight">プロジェクト</h1>
        <Link href="/create" className={buttonVariants({ size: "sm", className: "rounded-full" })}>
            <Plus className="mr-1.5 size-4" />
            新しくつくる
        </Link>
      </motion.div>

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-center gap-4 rounded-2xl border border-border/50 bg-card px-6 py-16 text-center"
          data-testid="empty-state"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <FolderOpen className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">まだプロジェクトがないよ</p>
            <p className="mt-1 text-sm text-muted-foreground">
              最初のサイトをつくってみよう
            </p>
          </div>
          <Link href="/create" className={buttonVariants({ size: "sm", className: "mt-2 rounded-full" })}>
              <Plus className="mr-1.5 size-4" />
              新しくつくる
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2"
          data-testid="project-grid"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={item}>
              <Link
                href={`/preview?template=${project.template_id}`}
                className="group block rounded-2xl border border-border/50 bg-card p-5 transition-colors hover:border-border hover:bg-accent/50"
                data-testid={`project-card-${project.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-medium leading-snug">{project.title}</h2>
                  <Badge
                    variant={project.status === "published" ? "default" : "secondary"}
                    className={
                      project.status === "published"
                        ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : ""
                    }
                  >
                    {project.status === "published" ? "公開中" : "下書き"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatDate(project.created_at)}
                </p>
                {project.published_slug && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ExternalLink className="size-3" />
                    <span>/s/{project.published_slug}</span>
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
}
