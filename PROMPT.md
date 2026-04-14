# PROMPT.md — 認証+DB 実装（dev-4担当）

## 背景
つくるん（Tsukurun）の認証・DB層の実装。dev-1がベースUI（LP, チャット, プレビュー, シェア）を実装済み。
あなたは **認証+DB** 担当として、不足している認証機能を追加する。

## 現状（既に実装済み）
- `src/lib/supabase/client.ts` — createBrowserClient() ✅
- `src/lib/supabase/server.ts` — createServerClient() ✅
- `src/lib/supabase/middleware.ts` — updateSession() ✅
- `src/middleware.ts` — Next.js middleware ✅
- `.env.local` — Supabase credentials設定済み ✅
- DB migration — 全テーブル+RLS適用済み ✅

## やること（これだけに集中）

### 1. Auth Callback Route
`src/app/auth/callback/route.ts` を作成:
```typescript
// Supabase Auth の code交換を行うGET handler
// /auth/callback?code=xxx → codeをsessionに交換 → /dashboard にリダイレクト
// エラー時は /login にリダイレクト
```
Supabase Auth helpersの標準パターンを使用。`@supabase/ssr` の `createServerClient` でcookies操作。

### 2. Login Page
`src/app/(auth)/login/page.tsx` を作成:
- LINE Login ボタン（将来的にLINE Loginを実装するためのプレースホルダー）
- 今はSupabase Email/Password認証で動くようにする（開発用）
- デザイン: DESIGN_SYSTEM.md準拠、ダークモード対応、rounded-2xl, shadow-sm

### 3. Signup Page
`src/app/(auth)/signup/page.tsx` を作成:
- Email/Password サインアップフォーム
- サインアップ成功 → メール確認 → /login にリダイレクト

### 4. Middleware 認証ガード更新
`src/lib/supabase/middleware.ts` を更新:
- 保護ルート(/dashboard, /create, /project)への未認証アクセスを /login にリダイレクト
- 公開ルート(/, /s/*, /auth/*, /api/*)はリダイレクトなし

### 5. Supabase Type Generation
`src/lib/supabase/types.ts` を更新（既存のtypesを確認後、DB schemaと一致させる）

### 6. テスト
- auth callback route のテスト
- middleware redirect のテスト
- login/signup ページのレンダリングテスト

## デザインルール
- DESIGN_SYSTEM.md準拠
- Apple/Notion/Linearレベルの品質
- グレースケール + アクセント1色（黒）
- rounded-2xl / shadow-sm / backdrop-blur-xl
- 1画面1意思決定
- ダークモード必須（next-themes）
- framer-motion でアニメーション
- 日本語UI

## LLM制約
- GLM API (GLM-4.7, コーディングプラン限定)のみ使用可能
- OpenAI API / GPT / OpenRouter は絶対に使わない
- このタスクではLLM APIを使わない（認証+DBのみ）

## Supabase接続情報
- URL: https://kqhfxkuvlqrsoijoazlu.supabase.co
- 環境変数は .env.local に設定済み

## 品質基準
- テスト駆動開発。テストなしのコードは書かない
- `npm run build` が通ること
- 全テストが通ること（npx vitest）

## 背景と意図
このプロダクトは「若者から世界をよくする」という信念のもと開発している。
ターゲットは日本の若者（大学生・20代前半）。やりたいことがない、大学に意味を見出せない、
自分の人生を自分で決められていない若者の構造的問題を解く。
Apple/Notion/Linearレベルのデザイン品質で、人間が「使いたい」と思うプロダクトを作る。
