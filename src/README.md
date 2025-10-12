# Source Directory (`src/`)

このディレクトリにはROCK CASTINGアプリケーションのメインソースコードが含まれています。

## 🚀 クイックスタート

### 前提条件

このプロジェクトを実行するには、以下のソフトウェアが必要です：

- **Node.js**: バージョン 18.17 以上
- **npm**: Node.jsに付属（または yarn、pnpm も使用可能）
- **Git**: リポジトリのクローンに必要

### インストール手順

#### 1. リポジトリのクローン

```bash
git clone https://github.com/your-repo/rock-casting.git
cd rock-casting
```

#### 2. 依存パッケージのインストール

```bash
npm install
```

または yarn を使用する場合：

```bash
yarn install
```

または pnpm を使用する場合：

```bash
pnpm install
```

#### 3. 開発サーバーの起動

```bash
npm run dev
```

または：

```bash
yarn dev
# または
pnpm dev
```

#### 4. ブラウザで確認

開発サーバーが起動したら、ブラウザで以下のURLにアクセスしてください：

```
http://localhost:3000
```

ホームページが表示されれば、セットアップ完了です！🎉

### 本番ビルド

本番環境用にビルドする場合：

```bash
npm run build
npm start
```

ビルドされたアプリケーションは最適化され、`http://localhost:3000` で起動します。

### トラブルシューティング

#### ポート 3000 が既に使用されている場合

別のポートを指定して起動できます：

```bash
PORT=3001 npm run dev
```

#### パッケージのインストールでエラーが発生する場合

キャッシュをクリアして再インストール：

```bash
rm -rf node_modules package-lock.json
npm install
```

Windows の場合：

```bash
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

## ディレクトリ構造

```
src/
├── app/           # Next.js App Router関連ファイル
├── components/    # 再利用可能なReactコンポーネント
└── styles/        # グローバルスタイルファイル
```

## 📂 `app/` ディレクトリ

Next.js 13+ App Routerを使用したアプリケーションのルーティングとレイアウト管理。

### ファイル構成

```
app/
├── layout.tsx          # ルートレイアウト（全ページ共通）
├── page.tsx            # ホームページ（/）
├── top/
│   └── page.tsx        # トップページ（/top）
└── usage_guide/
    └── page.tsx        # 利用ガイドページ（/usage_guide）
```

### 主要ファイル

#### `layout.tsx`

- **役割**: アプリケーション全体の共通レイアウト
- **機能**:
  - HTMLの基本構造（`<html>`, `<body>`）
  - メタデータ設定（SEO対応）
  - Google Fonts（Inter）の読み込み
  - グローバルスタイルの適用

#### `page.tsx`

- **役割**: ホームページ（`/`）のメインコンポーネント
- **機能**:
  - 各セクションコンポーネントの統合
  - Figmaデザインに基づいたページ構成

#### `top/page.tsx`

- **役割**: トップページ（`/top`）
- **機能**:
  - Hero から CTA までのセクションを含む
  - サービスの主要情報を表示

#### `usage_guide/page.tsx`

- **役割**: 利用ガイドページ（`/usage_guide`）
- **機能**:
  - サービスの利用料金と規約を説明
  - キャンセルポリシーなどの詳細情報を提供
  - フッターの「ヘルプ・ご利用ガイド」からアクセス可能

## 📂 `components/` ディレクトリ

再利用可能なReactコンポーネントを格納。各コンポーネントは特定の機能やUIセクションを担当。

### ディレクトリ構造

コンポーネントは2つの形式で構成されています：

1. **単一ファイルコンポーネント**: シンプルなコンポーネント（`.tsx`ファイル）
2. **ディレクトリ型コンポーネント**: `index.tsx` + `images/` サブディレクトリを持つ

### コンポーネント一覧

```
components/
├── About/                # 特徴・About usセクション
│   ├── index.tsx
│   └── images/
│       ├── about_01.png
│       ├── about_02.png
│       ├── about_03.png
│       └── about_bg.png
├── Cast/                 # キャスト一覧セクション
│   ├── index.tsx
│   └── images/
│       ├── cast_01.png
│       └── cast_bg.png
├── CTA/                  # Call To Action（登録誘導）
│   ├── index.tsx
│   └── images/
│       ├── banner_pc.png
│       └── banner_sp.png
├── Faq/                  # よくある質問セクション
│   └── index.tsx
├── Flow/                 # お仕事の流れセクション
│   ├── index.tsx
│   └── images/
│       ├── flow_01.png ~ flow_06.png
│       └── flow_bg.png
├── Function/             # 機能紹介セクション
│   ├── index.tsx
│   └── images/
│       ├── function_01.png ~ function_03.png
│       └── function_bg.png
├── Hero/                 # ヒーローセクション
│   ├── index.tsx
│   └── images/
│       ├── hero_top_background_1.png
│       ├── kv_slide_01.png ~ kv_slide_03.png
│       ├── kv_slide_08.png
│       └── red_border.png
├── Service/              # サービス・料金セクション
│   ├── index.tsx
│   └── images/
│       └── lawsuit_bg_pc.png
├── UsageGuide/           # 利用ガイドセクション
│   └── index.tsx
├── Voice/                # お客様の声セクション
│   ├── index.tsx
│   └── images/
│       ├── voice_01.png
│       ├── voice_cover_pc.png
│       ├── voice_cover_sp.png
│       └── voice02.png
├── Header.tsx            # ナビゲーションヘッダー
├── Footer.tsx            # フッター
├── Features.tsx          # 機能特徴（未使用）
└── Testimonials.tsx      # 証言（未使用）
```

### 各コンポーネントの詳細

#### 🧭 `Header.tsx`

- **機能**: サイト全体のナビゲーション
- **特徴**:
  - レスポンシブメニュー（ハンバーガーメニュー）
  - ログイン・登録ボタン
  - 固定ヘッダー（`position: fixed`）

#### 🎯 `Hero/`

- **機能**: ファーストビューのメインビジュアル
- **特徴**:
  - キャッチコピー表示
  - 右側にキャスト画像エリア（デスクトップ）
  - CTAボタン
- **画像アセット**:
  - 背景画像、スライド画像（kv_slide_01~03, 08）
  - デコレーション画像（red_border.png）

#### 💰 `Service/`

- **機能**: サービス内容と料金表示
- **特徴**:
  - 「10,000円から」の料金表示
  - サービス概要説明
- **画像アセット**: lawsuit_bg_pc.png

#### ℹ️ `About/`

- **機能**: サービスの特徴・選ばれる理由
- **特徴**:
  - 3つの特徴カード
  - 登録CTAボタン
- **画像アセット**:
  - about_01.png ~ about_03.png（特徴カード画像）
  - about_bg.png（背景画像）

#### 👥 `Cast/`

- **機能**: キャスト一覧とカテゴリ表示
- **特徴**:
  - タブ切り替え（フォトグラファー/モデル/アーティスト/クリエイター）
  - キャストカードのグリッド表示
  - 「もっと見る」ボタン
- **画像アセット**:
  - cast_01.png（サンプル画像）
  - cast_bg.png（背景画像）

#### ⚙️ `Function/`

- **機能**: プラットフォームの3つの主要機能
- **特徴**:
  - 安心サポート
  - オファーテンプレート
  - 充実の検索機能
- **画像アセット**:
  - function_01.png ~ function_03.png（機能説明画像）
  - function_bg.png（背景画像）

#### 💬 `Voice/`

- **機能**: お客様の声・事例紹介
- **特徴**:
  - 3つの実際の利用事例
  - 業種・費用・感想の表示
- **画像アセット**:
  - voice_01.png, voice02.png（利用者画像）
  - voice_cover_pc.png, voice_cover_sp.png（カバー画像）

#### 📋 `Flow/`

- **機能**: サービス利用の流れ（6ステップ）
- **特徴**:
  - ステップ番号付きカード
  - 矢印でのフロー表示
  - 3列×2行のグリッドレイアウト
- **画像アセット**:
  - flow_01.png ~ flow_06.png（各ステップ画像）
  - flow_bg.png（背景画像）

#### 📢 `CTA/`

- **機能**: 新規登録への誘導
- **特徴**:
  - 「今すぐ無料登録！」メッセージ
  - 登録ボタン
- **画像アセット**:
  - banner_pc.png（PC用バナー）
  - banner_sp.png（スマホ用バナー）

#### ❓ `Faq/`

- **機能**: よくある質問セクション
- **特徴**:
  - Q&A形式での情報提示
  - 質問（Q）は黒、回答（A）は赤で表示
  - 常時展開表示（トグル不要）

#### 📄 `UsageGuide/`

- **機能**: 利用ガイド・料金説明ページ
- **特徴**:
  - Usage fee タイトル表示
  - キャストへの報酬/入会の2つの情報表示
  - 利用料金、決済方法、キャンセルポリシーの詳細
  - オレンジ色のSVG縦線でセクション分け
  - キャンセル料金テーブル表示
- **特記事項**:
  - `/usage_guide` ルートでアクセス可能
  - フッターの「ヘルプ・ご利用ガイド」ボタンからリンク

#### 🦶 `Footer.tsx`

- **機能**: サイトフッター
- **特徴**:
  - 「ROCK CASTING」タイトル表示
  - サービスリンク集（2列グリッド）
  - 規約・法的情報リンク（2列グリッド）
  - お問い合わせボタン
  - ヘルプ・ご利用ガイドボタン（オレンジ色）
  - 上部セクション（グレー背景）と下部セクション（黒背景）に分割

## 🎨 `styles/` ディレクトリ

### `globals.css`

- **機能**: アプリケーション全体のスタイル
- **内容**:
  - Tailwind CSSの読み込み
  - カスタムスタイル（ロック調デザイン）
  - スクロールバーのカスタマイズ
  - ユーティリティクラス

## 🔧 技術仕様

### 使用技術

- **Next.js 15**: App Router使用
- **React 19**: 最新のReact機能
- **TypeScript**: 型安全な開発
- **Tailwind CSS**: ユーティリティファーストCSS

### デザインコンセプト

- **カラーパレット**: 黒ベース + 赤アクセント
- **レスポンシブ**: モバイルファースト設計
- **アクセシビリティ**: 適切なコントラスト比とキーボードナビゲーション

### コンポーネント設計原則

1. **単一責任**: 各コンポーネントは1つの機能に集中
2. **再利用性**: 可能な限り再利用可能な設計
3. **型安全**: TypeScriptによる厳密な型定義
4. **パフォーマンス**: React の最適化機能を活用

## 🚀 開発ガイドライン

### 新しいコンポーネント追加時

1. TypeScriptで型定義を明確にする
2. `'use client'`ディレクティブを適切に使用
3. インラインスタイル（`style`プロップ）を優先的に使用
4. レスポンシブ対応を必須とする（`<style jsx>`でメディアクエリを実装）
5. アクセシビリティを考慮する

### コンポーネント構造の選択

**単一ファイル形式** (シンプルなコンポーネント向け):

```
components/
└── ComponentName.tsx
```

**ディレクトリ形式** (画像アセットを含むコンポーネント向け):

```
components/
└── ComponentName/
    ├── index.tsx
    └── images/
        ├── image_01.png
        └── bg.png
```

### ファイル命名規則

- コンポーネント: PascalCase（例: `Header.tsx`, `Hero/index.tsx`）
- ディレクトリ: PascalCase（例: `About/`, `Cast/`）
- 画像ファイル: snake_case（例: `flow_01.png`, `cast_bg.png`）
- 関数: camelCase（例: `handleClick`）

### スタイリングガイドライン

- **優先順位**: インラインスタイル > Tailwind CSS
- **レスポンシブ**: `<style jsx>`を使用してメディアクエリを実装
- **画像の読み込み**: `import image from './images/image.png'` でインポート
- **背景画像**: `backgroundImage: url(${image.src})` で適用

---

**作成日**: 2025年9月30日  
**最終更新**: 2025年10月12日  
**バージョン**: 1.2.0
