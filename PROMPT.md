# デザイン仕上げ — つくるん（Tsukurun）AQ#17

## 現状分析（2026-04-14 14:42 JST時点）

### ✅ 既に実装済み（やらない）
- framer-motion: hero-section, header, create/page, chat-panel等に既に実装済み
- globals.css: ダークモード変数定義済み（.dark クラス）
- theme-provider.tsx: コンポーネント作成済み
- 各UIコンポーネント: button, card, avatar, badge, scroll-area, textarea等
- ページ: create, preview, share 実装済み
- API routes: chat, publish 実装済み

### ❌ 修正が必要（ここをやる）

#### 1. layout.tsx — ThemeProvider統合 + メタデータ設定
現状: scaffoldのまま。ThemeProviderを使っていない。
修正内容:
- `lang="en"` → `lang="ja"`
- `<html>` に `suppressHydrationWarning` 追加（next-themes用）
- ThemeProviderで `<body>` をラップ
- metadata: title "つくるん — AIと話すだけでwebツールが完成", description設定
- フォント: Geist → Inter + Noto Sans JP に変更（DESIGN_SYSTEM.md準拠）
- `import { ThemeProvider } from "@/components/theme-provider"`

#### 2. page.tsx — LP統合
現状: scaffold（Create Next Appのデフォルト）
修正内容:
- hero-section.tsxとexamples-section.tsxをインポートして表示
- app-shell.tsx（Header含む）でラップ
- 古いscaffold内容を完全に置き換え

#### 3. レスポンシブ確認（375px）
- max-w-lg センタリングが全ページで効いているか確認
- タップターゲット48px以上確認
- 375px幅で崩れないか確認

#### 4. DESIGN_SYSTEM.md 禁止事項チェック
- グラデーション背景なし ✓（確認）
- shadow-lg以上なし（shadow-sm + hover:shadow-mdのみ）
- ボーダー薄い（border-border/50）
- 色3色以内（グレースケール + アクセント1色）
- 角丸統一（rounded-2xl or rounded-full）
- p-4未満のパディングなし
- アイコンだけのボタンなし
- 全テキスト日本語
- shadcn/uiカスタマイズ済み

#### 5. 日本語UI品質
- 全テキストが自然な日本語か確認
- ボタンラベルが動詞か確認
- 見出しが短く動詞から始まっているか

## LLM設定
- GLM API (GLM-4.7) のみ使用
- GLM_BASE_URL: https://api.z.ai/api/coding/paas/v4/
- OpenAI/GPT/OpenRouter は絶対に使わない

## ドメイン
- 独自ドメイン禁止。.vercel.app のみ使用

## 作業手順
1. layout.tsxを修正（ThemeProvider統合、メタデータ、lang="ja"、フォント変更）
2. page.tsxを修正（scaffold削除、hero-section + examples-section + app-shell統合）
3. 全ページのレスポンシブ確認（375px最小幅）
4. DESIGN_SYSTEM.md禁止事項の全チェック
5. 日本語テキスト品質確認
6. npm run build通ることを確認
7. npm test でテストが全て通ることを確認

## 注意
- 既存のframer-motionアニメーションは既に実装されているので触らない
- CSS変数は既に正しく設定されているので触らない
- 新しいパッケージのインストールは不要（framer-motion, next-themes, lucide-react は既にインストール済み）
- テストファイルが既に存在するので、修正後もテストが通るようにすること
