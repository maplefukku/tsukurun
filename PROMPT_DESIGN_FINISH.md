# デザイン仕上げ — つくるん（Tsukurun）AQ#17

## 概要
dev-1/2の実装が完了した後、デザイン仕上げを行う。以下を担当:
1. framer-motion アニメーション追加
2. ダークモード（next-themes）対応
3. レスポンシブ対応（375px最小幅）
4. DESIGN_SYSTEM.md禁止事項チェック
5. 日本語UI品質改善

## PRD（抜粋）
- アプリ名: つくるん（Tsukurun）
- 1行説明: AIと話すだけでwebツールが完成
- ユーザー: 21歳文系大学生、非エンジニア
- コア機能: AI雑談→テンプレート生成 + ワンクリック公開+シェア
- 技術: Next.js App Router + Tailwind CSS + shadcn/ui + framer-motion + GLM API

## 画面構成（全4画面）
1. ランディング（LP）— ヒーロー + CTA + 作品例
2. チャット画面 — AI雑談 → テンプレート提案
3. プレビュー画面 — 生成結果確認 + シェアCTA
4. シェア完了画面 — URL発行 + シェアボタン + もう1つ作る

## DESIGN_SYSTEM.md 準拠事項

### カラー
- ライト: --background #FFFFFF / --foreground #0A0A0A / --muted #F5F5F5
- ダーク: --background #0A0A0A / --foreground #FAFAFA / --muted #171717
- グレースケール + アクセント1色のみ

### タイポグラフィ
- ヒーロー: `text-4xl font-bold tracking-tight sm:text-5xl`
- セクション見出し: `text-3xl font-semibold`
- カード見出し: `text-xl font-semibold`
- 本文: `text-base leading-relaxed`
- 補足: `text-sm text-muted-foreground`
- ラベル: `text-xs font-medium uppercase tracking-wider`

### コンポーネント
- ボタン: `rounded-full` / `h-12` / 1画面にプライマリ1つ
- カード: `rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md`
- 入力: `h-12 rounded-xl border-border/50 bg-muted/50 focus:border-foreground focus:ring-0`
- ヘッダー: `sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl` / `max-w-lg mx-auto h-14`

### レイアウト
- `max-w-lg` (512px) センタリング
- `min-h-dvh`
- タップターゲット 48px以上

## アニメーション仕様（framer-motion）

### ページ遷移
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
```

### チャットメッセージ出現
```tsx
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ type: "spring", stiffness: 500, damping: 30 }}
```

### タイピングインジケーター
3ドットの波打ちアニメーション:
```tsx
animate={{ opacity: [0.3, 1, 0.3] }}
transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
```

### 生成中ローディング
- animate-pulse禁止 → スタガーフェード
- 段階的テキスト: 「作ってるよ...」→「もうすぐ...」→「できた！」

### 完了演出
- プレビュー: `initial={{ opacity: 0, scale: 0.9, y: 20 }}` → spring
- チェックマーク: `initial={{ scale: 0, rotate: -180 }}` → spring
- ボタン群: スタガー `delay: i * 0.05`

### ボタン
- `active:scale-95 transition-transform`
- `hover:opacity-90 transition-opacity`

## ダークモード（next-themes）
```tsx
import { ThemeProvider } from 'next-themes'
// layout.tsx
<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```
全コンポーネントで `dark:` プレフィックス対応必須。

## レスポンシブ
- 375px最小幅で崩れないこと
- モバイルファースト設計
- タップターゲット48px以上

## 日本語UI品質
- 全テキスト自然な日本語
- 翻訳くさくない表現
- ボタンラベルは動詞
- 見出しは短く、動詞から始める

## 禁止事項（DESIGN_SYSTEM.mdより）
1. グラデーション背景 — 禁止
2. shadow-lg以上 — 禁止（shadow-sm + hover:shadow-mdのみ）
3. ボーダー目立すぎ — `border-border/50` で薄く
4. 色3色以上 — グレースケール + アクセント1色
5. 角丸バラバラ — rounded-2xl か rounded-full
6. フォントサイズ乱立 — スケール準拠
7. 余白狭い — p-4未満禁止
8. アイコンだけのボタン — ラベル付き必須
9. 英語のまま — 全て日本語
10. shadcn/uiデフォルト — カスタマイズ必須

## LLM設定
- GLM API (GLM-4.7) のみ使用
- GLM_BASE_URL: https://api.z.ai/api/coding/paas/v4/
- OpenAI/GPT/OpenRouter は絶対に使わない

## ドメイン
- 独自ドメイン禁止。.vercel.app のみ使用

## 作業手順
1. 既存コード全体を把握（git pull後）
2. 各ページにframer-motionアニメーション追加
3. next-themesでダークモード対応
4. 375pxでレスポンシブ確認
5. DESIGN_SYSTEM.md禁止事項を全チェック
6. 日本語テキストの品質確認
7. npm run build通ることを確認
8. テストが全て通ることを確認
