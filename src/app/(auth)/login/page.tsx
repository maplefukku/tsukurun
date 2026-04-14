"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm backdrop-blur-xl">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-1 text-xl font-semibold tracking-tight text-foreground"
          >
            ログイン
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-6 text-sm text-muted-foreground"
          >
            メールアドレスとパスワードでログイン
          </motion.p>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                メールアドレス
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                パスワード
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 rounded-xl"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full text-sm font-medium"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </Button>
          </motion.form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            アカウントをお持ちでない方は{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              アカウント作成
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
