# PROMPT.md — つくるん（Tsukurun）メインUI実装

## 概要
「AIと雑談するだけでWebツールが生まれる」サービスのメインUIを実装する。
4画面構成: LP → チャット画面 → プレビュー画面 → シェア完了画面

## 技術スタック
- Next.js App Router + TypeScript + Tailwind CSS
- shadcn/ui（カスタマイズ必須）
- framer-motion（アニメーション全て）
- next-themes（ダークモード）
- lucide-react（アイコン）
- GLM API（glm-4.7、OpenAI互換SDK経由）
- Supabase（DB・認証）
- vitest + @testing-library/react（テスト）

## 実装する画面

### 画面1: LP（ランディングページ）— src/app/page.tsx
- ヒーロー見出し: 「話すだけで、Webツールができる。」
- サブコピー: 「『何を作るか』はAIと一緒に考えよう」
- CTA: 「作ってみる」ボタン（rounded-full、プライマリ）
- 作品例セクション: 「みんなが作ったもの」カード2-3個
- 補足: 「30分で完成。コード不要。」
- sticky header（backdrop-blur-xl、ロゴ+ログイン）
- framer-motion: ページ遷移アニメーション（opacity + y）

### 画面2: チャット画面 — src/app/create/page.tsx
- AIが先に話しかける（「こんにちは！最近ハマってることとかある？何でもいいよ」）
- ユーザーメッセージ: 右寄せ、bg-foreground text-background
- AIメッセージ: 左寄せ、アバター付き、bg-muted
- タイピングインジケーター（3ドット波打ち、framer-motion）
- 提案カード: テンプレート名+説明+「これにする！」CTA
- 入力エリア: 画面下部固定、rounded-xl Input + 送信ボタン
- GLM API連携: /api/chat でストリーミング（SSE）
- framer-motion: メッセージ出現spring、提案カードスライドイン

### 画面3: プレビュー画面 — src/app/preview/page.tsx
- ローディング状態: スケルトンUI（framer-motion スタガー）+ 段階的テキスト
- 完成時: プレビューフレーム（rounded-2xl border shadow-sm、iframe）
- 完了演出: motion.div ポップイン（opacity+scale+spring）
- CTA: 「友達にシェアする」（プライマリ）+「もう少し変えたい」（outline）

### 画面4: シェア完了画面 — src/app/share/page.tsx
- チェックマーク: 回転+拡大springアニメーション
- URL表示: mono font + コピーボタン
- シェアボタン: 「LINEで送る」「Xでシェア」「リンクをコピー」
- CTA: 「もう1つ作ってみる」→ チャット画面へ
- 導線: 「次はどんなの作る？」

### 共通コンポーネント
- Header: sticky, backdrop-blur-xl, max-w-lg
- ChatPanel, MessageBubble, SuggestionChips
- PreviewFrame
- ShareDialog
- AppShell: min-h-dvh, max-w-lg centering

### API Routes
- POST /api/chat: GLM API ストリーミング連携
- POST /api/publish: サイト公開

### テスト
- 全コンポーネントのunit test
- API route のintegration test
- GLM API・Supabase はモック

## デザインルール（DESIGN_SYSTEM.md）
- カラー: グレースケール + アクセント1色（黒or白）
- 角丸: rounded-2xl or rounded-full のみ
- 影: shadow-sm + hover:shadow-md のみ（shadow-lg以上禁止）
- ボーダー: border-border/50 で薄く
- パディング: p-4以上
- レイアウト: max-w-lg (512px) センタリング
- ヘッダー: h-14 sticky backdrop-blur-xl
- ボタン: h-12以上、rounded-full
- 入力: h-12 rounded-xl
- animate-pulse禁止（スケルトンはframer-motion）
- Apple的イージング: ease: [0.25, 0.46, 0.45, 0.94]

## GLM API設定
```typescript
import OpenAI from "openai";
const glm = new OpenAI({
  apiKey: process.env.GLM_API_KEY,
  baseURL: process.env.GLM_BASE_URL, // https://api.z.ai/api/coding/paas/v4/
});
// model: glm-4.7
```
GLM_API_KEYはサーバーサイドのみ。NEXT_PUBLIC_プレフィックス禁止。

## 背景と意図
このプロダクトは「若者から世界をよくする」という信念のもと開発している。
ターゲットは日本の若者（大学生・20代前半）。
Apple/Notion/Linearレベルのデザイン品質で、人間が「使いたい」と思うプロダクトを作る。

## 作業プロセス（厳守）

### Phase 1: 現状把握
1. PROMPT.mdとCLAUDE.mdを読む
2. 既存コード（create-next-app直後）の構造を確認
3. 何が求められているか理解する

### Phase 2: セットアップ
1. shadcn/ui初期化 + 必要コンポーネント追加
2. next-themes, framer-motion, lucide-react インストール
3. Tailwind CSS設定（カラー変数、フォント）
4. vitest設定

### Phase 3: 実装
1. 共通レイアウト（RootLayout, Header, AppShell）
2. LP（page.tsx）
3. チャット画面（create/page.tsx + コンポーネント）
4. プレビュー画面（preview/page.tsx）
5. シェア完了画面（share/page.tsx）
6. API Routes（/api/chat, /api/publish）
7. GLM APIクライアント（lib/glm/）

### Phase 4: テスト
1. 各コンポーネントのunit test
2. API routeのintegration test
3. ビルド確認

### Phase 5: レビュー
1. TypeScript型エラーなし
2. npm run build通る
3. DESIGN_SYSTEM.md禁止事項に違反なし
4. 日本語UI品質チェック

### 完了報告フォーマット
STATUS: OK or FAIL
FILES_CHANGED: [file list]
TEST_RESULT: X passed, Y failed, coverage XX%
BUILD: pass/fail
DEPLOY_READY: yes/no
REVIEW_ISSUES: [残存問題あれば]

## Web検索の活用
- 最新のライブラリバージョンや仕様が不明な場合はWebSearchで調べること
- Next.js、shadcn/ui、Supabase等の最新APIはドキュメントを検索して確認
- エラーが出たらエラーメッセージでWeb検索して解決策を探す
- 「自分の知識が古いかもしれない」と思ったら必ず検索する

## 注意
- ドメインは .vercel.app のみ。独自ドメイン取得禁止
- LLM: GLM API (GLM-4.7) のみ。OpenAI/GPT/OpenRouter禁止
- テスト駆動開発で実装すること
- 全テキスト自然な日本語
