# Rock Casting Platform

キャスティングマッチングプラットフォーム - モデル・カメラマン・スタイリスト等と企業を繋ぐプロフェッショナルなキャスティングサービス

## 📋 目次

- [概要](#概要)
- [技術スタック](#技術スタック)
- [アーキテクチャ](#アーキテクチャ)
- [環境構築](#環境構築)
- [ディレクトリ構造](#ディレクトリ構造)
- [開発ガイド](#開発ガイド)
- [データベース設計](#データベース設計)
- [API仕様](#api仕様)
- [トラブルシューティング](#トラブルシューティング)

---

## 📖 概要

Rock Castingは、クリエイター特化型の人材マッチングプラットフォームです。キャスト選びを「運任せ」にしない、プロフェッショナルなキャスティングサービスを提供します。

### 主な機能

- ✅ **ユーザー登録・認証** - 個人/企業の新規登録、ログイン機能
- 🔄 **役割別プロフィール管理** - キャスト（受注者）と発注者のプロフィール管理
- 📝 **プロフィール編集** - 詳細情報の登録・更新
- 🔐 **セキュアな認証** - Supabase Authによる安全な認証システム

---

## 🛠 技術スタック

### フロントエンド
- **Next.js 15** (App Router) - React フレームワーク
- **React 19** - UIライブラリ
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング

### バックエンド
- **Next.js Route Handlers** - APIエンドポイント
- **tRPC** - 型安全なAPI通信
- **Zod** - スキーマバリデーション

### データベース
- **Supabase** - PostgreSQL + PostGIS + Realtime + Auth
- **Prisma** - ORM（Object-Relational Mapping）

### 開発ツール
- **Prisma Migrate** - データベースマイグレーション
- **ESLint** - コード品質チェック

### ホスティング
- **Vercel** - フロントエンド・バックエンドのホスティング

---

## 🏗 アーキテクチャ

### 全体構成

```
┌─────────────────┐
│   Next.js App   │
│  (Frontend +    │
│   Backend API)  │
└────────┬────────┘
         │
         ├─ tRPC Router
         │  ├─ auth (認証)
         │  └─ profile (プロフィール)
         │
         ├─ Prisma Client
         │  └─ Database Access
         │
         └─ Supabase
            ├─ Auth (認証)
            ├─ PostgreSQL (データベース)
            └─ Realtime (リアルタイム機能)
```

### レイヤー構造

1. **Presentation Layer** (`src/app/`, `src/components/`)
   - Next.js App Routerによるページルーティング
   - ReactコンポーネントによるUI実装

2. **API Layer** (`src/app/api/trpc/`)
   - tRPCによる型安全なAPIエンドポイント
   - Next.js Route HandlersでHTTPリクエストを処理

3. **Business Logic Layer** (`src/server/routers/`)
   - tRPC Routerによるビジネスロジック
   - バリデーション（Zod）とエラーハンドリング

4. **Data Access Layer** (`src/lib/prisma.ts`)
   - Prisma Clientによるデータベースアクセス
   - 型安全なクエリビルダー

5. **Database Layer** (Supabase PostgreSQL)
   - リレーショナルデータベース
   - Supabase Authによる認証管理

### データフロー

```
ユーザー操作
    ↓
React Component (フォーム送信)
    ↓
tRPC Client (型安全なAPI呼び出し)
    ↓
tRPC Router (バリデーション + ビジネスロジック)
    ↓
Prisma Client (データベース操作)
    ↓
Supabase PostgreSQL (データ保存)
    ↓
レスポンス返却
```

---

## 🚀 環境構築

### 前提条件

- **Node.js** 18.x 以上
- **npm** 9.x 以上
- **Git**
- **Supabaseアカウント** ([https://supabase.com](https://supabase.com))

### 1. リポジトリのクローン

```bash
git clone https://github.com/sunnyrocks63964/rock-casting.git
cd rock-casting
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Supabaseプロジェクトの作成

1. [Supabaseダッシュボード](https://supabase.com/dashboard)にアクセス
2. 「New Project」をクリック
3. プロジェクト情報を入力：
   - **Project Name**: `rock-casting-dev`（任意）
   - **Database Password**: 強力なパスワードを設定（後で使用します）
   - **Region**: `Northeast Asia (Tokyo)` を推奨
4. プロジェクト作成完了を待つ（1-2分）

### 4. Supabase認証情報の取得

1. Supabaseダッシュボードで作成したプロジェクトを開く
2. **Settings** → **API** に移動
3. 以下の情報をコピー：
   - **Project URL** (例: `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key（⚠️ 秘密鍵、絶対に公開しない）

### 5. データベース接続文字列の取得

1. **Settings** → **Database** に移動
2. **Connection string** セクションで以下を確認：
   - **URI** タブ: 直接接続用（ポート5432、マイグレーション用）
   - **Connection pooling** セクション → **Transaction** モード: 接続プーリング用（ポート6543、Vercelなどのサーバーレス環境で推奨）
3. Vercelなどのサーバーレス環境では、**Connection pooling** の **Transaction** モードのURLを使用してください
4. 接続文字列をコピー（`[YOUR-PASSWORD]`を実際のパスワードに置き換える）

⚠️ **重要**: 接続プーリング用のURLは通常、`pooler.supabase.com`ドメインを使用します。
例: `postgresql://postgres:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres`

### 6. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

- 環境変数は https://docs.google.com/document/d/1rs5G8VmsjNTEc8OAr7sUZzjFfVhiSatfYtwgLxdJC5E/edit?tab=t.0#heading=h.ksbfmo5mfll に記載しています。
  - ceo@sunnyrocks32169.com を管理している人から権限付与

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Connection String
DATABASE_URL=postgresql://postgres:your_password@db.your-project-id.supabase.co:5432/postgres

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

⚠️ **重要**: `.env.local`は`.gitignore`に含まれているため、Gitにコミットされません。本番環境では、Vercelの環境変数設定で同様の値を設定してください。

### 6-1. Vercel環境変数の設定

Vercelにデプロイする場合、以下の環境変数をVercelダッシュボードで設定する必要があります：

1. **Vercelダッシュボードにアクセス**
   - [Vercel Dashboard](https://vercel.com/dashboard) にログイン
   - プロジェクトを選択

2. **環境変数の設定**
   - プロジェクトの **Settings** → **Environment Variables** に移動
   - 以下の環境変数を追加：

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   DATABASE_URL=postgresql://postgres:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
   DIRECT_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.your-project-id.supabase.co:5432/postgres
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
   
   ⚠️ **重要**: 
   - `DATABASE_URL`は**接続プーリング用**（`pooler.supabase.com`ドメイン、ポート6543）を使用してください。Vercelのようなサーバーレス環境では必須です。
   - 接続プーリングURLは、Supabaseダッシュボードの **Settings** → **Database** → **Connection pooling** → **Transaction** モードから取得できます。
   - `DIRECT_DATABASE_URL`はマイグレーション用の直接接続URL（`db.project-id.supabase.co`ドメイン、ポート5432）です。設定しなくても動作しますが、マイグレーションを実行する場合は必要です。

3. **環境変数の適用範囲**
   - **Production**: 本番環境用
   - **Preview**: プレビュー環境用（任意）
   - **Development**: 開発環境用（通常は不要）

4. **再デプロイ**
   - 環境変数を設定した後、**Deployments** タブから最新のデプロイを再デプロイするか、新しいコミットをプッシュして再デプロイをトリガー

⚠️ **注意**: 
- `SUPABASE_SERVICE_ROLE_KEY` はサーバーサイドでのみ使用されるため、**必ず設定してください**
- `DATABASE_URL` はPrismaがデータベースに接続するために必要です
- 環境変数を設定後、必ず再デプロイしてください

### 6-2. デプロイ手順

#### Staging環境

**devブランチにマージした時点で自動的にデプロイされます。**

VercelのPreviewデプロイ機能により、`dev`ブランチへのマージ・プッシュでStaging環境が更新されます。

#### Production環境

本番環境へのデプロイは、GitHub Actionsの手動実行で行います。

1. **GitHubリポジトリにアクセス**
   - [Actions](https://github.com/sunnyrocks63964/rock-casting/actions) タブを開く

2. **ワークフローを選択**
   - 左サイドバーから「Deploy to Production」を選択

3. **手動実行**
   - 「Run workflow」ボタンをクリック
   - `main`ブランチの最新コードが本番環境にデプロイされます

4. **必要シークレット**
   - 以下のGitHub Secretsが設定されている必要があります：
     - `VERCEL_TOKEN`: Vercelの認証トークン
     - `VERCEL_ORG_ID`: Vercel組織ID
     - `VERCEL_PROJECT_ID`: VercelプロジェクトID

```
┌─────────────┐    マージ/プッシュ    ┌─────────────┐
│  dev ブランチ │ ──────────────────► │ Staging環境  │
└─────────────┘    （自動デプロイ）   └─────────────┘

┌─────────────┐  手動実行(workflow_dispatch)  ┌─────────────┐
│ main ブランチ │ ─────────────────────────────► │Production環境│
└─────────────┘   GitHub Actions経由          └─────────────┘
```

#### Prismaビルドエラー対策（オプション）

Prismaのバイナリダウンロードでエラーが発生する場合、以下の環境変数を追加してください：

- `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1`

この環境変数は、Prismaのチェックサム検証をスキップします。Vercelの環境変数設定で追加するか、`package.json`のスクリプトに既に含まれています。

### 7. PostGIS拡張の有効化

Supabaseダッシュボードで以下を実行：

1. **SQL Editor**を開く
2. 新しいクエリを作成し、以下を実行：

```sql
-- UUID拡張を有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PostGIS拡張を有効化（将来の位置情報検索用）
CREATE EXTENSION IF NOT EXISTS postgis;
```

3. **Run**ボタンをクリック

### 8. データベースマイグレーションの実行

```bash
# Prisma Clientの生成
npx prisma generate

# データベースマイグレーションの実行
npx prisma migrate dev --name initial_minimal_schema
```

### 9. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて動作確認してください。

---

## 📁 ディレクトリ構造

```
rock-casting/
├── prisma/
│   ├── migrations/          # データベースマイグレーションファイル
│   └── schema.prisma        # Prismaスキーマ定義
├── src/
│   │   ├── api/
│   │   │   ├── trpc/        # tRPC APIエンドポイント
│   │   │   └── webhooks/
│   │   │       └── stripe/ # Stripe Webhook
│   │   ├── cast/detail/     # キャスト詳細ページ
│   │   ├── caster/          # キャスター向け（契約・お気に入り・メッセージ・マイページ）
│   │   ├── login/           # ログインページ
│   │   ├── order/           # 発注者向け（プロジェクト・契約・お気に入り・メッセージ等）
│   │   ├── order-work/      # 仕事を発注するページ
│   │   ├── receive-work/    # 仕事を受けるページ
│   │   ├── top/             # トップ（キャスター・発注者）
│   │   ├── user_register/   # ユーザー登録ページ
│   │   ├── password_reset/  # パスワードリセット
│   │   ├── reset-password/  # パスワード再設定
│   │   ├── project/detail/  # プロジェクト詳細
│   │   ├── privacy_policy/  # プライバシーポリシー
│   │   ├── terms_of_service/# 利用規約
│   │   ├── security_policy/ # セキュリティポリシー
│   │   ├── usage_guide/     # 利用ガイド
│   │   ├── commercial_law/  # 商法
│   │   ├── trademark_patent/# 商標・特許
│   │   ├── service_environment/# サービス環境
│   │   ├── external_transmission/# 外部送信
│   │   ├── interview_schedule/# 面接スケジュール
│   │   ├── layout.tsx       # ルートレイアウト
│   │   ├── page.tsx         # ルートページ
│   │   ├── robots.ts       # robots.txt
│   │   └── sitemap.ts      # サイトマップ
│   ├── components/          # Reactコンポーネント
│   │   ├── UserRegister/   # ユーザー登録
│   │   ├── Login/          # ログイン
│   │   ├── Cast/           # キャスト一覧
│   │   ├── CastDetail/     # キャスト詳細
│   │   ├── TopOrder/       # 発注者トップ
│   │   ├── TopCaster/      # キャスタートップ
│   │   ├── Header/         # ヘッダー・ナビゲーション
│   │   ├── Footer/         # フッター
│   │   ├── Hero/           # ヒーローセクション
│   │   └── ...             # その他ページ用コンポーネント
│   ├── lib/                 # ユーティリティ・ライブラリ
│   │   ├── prisma.ts       # Prisma Client設定
│   │   ├── supabase.ts     # Supabase Client設定
│   │   ├── env.ts          # 環境変数
│   │   ├── email/          # メール送信
│   │   ├── trpc/           # tRPC Client設定
│   │   ├── validations/    # Zodスキーマ定義
│   │   ├── types/          # 型定義（authType, userType）
│   │   ├── utils/          # ユーティリティ
│   │   └── security/       # セキュリティ関連
│   ├── server/              # サーバーサイドコード
│   │   ├── routers/        # tRPC Router定義
│   │   │   ├── _app.ts     # メインRouter
│   │   │   ├── auth.ts     # 認証Router
│   │   │   ├── profile.ts  # プロフィールRouter
│   │   │   ├── payment.ts  # 決済Router
│   │   │   ├── project.ts  # プロジェクトRouter
│   │   │   ├── message.ts  # メッセージRouter
│   │   │   ├── favorite.ts # お気に入りRouter
│   │   │   └── workAreas.ts# 勤務地Router
│   │   └── trpc.ts         # tRPC初期化
│   ├── constants/           # 定数（地域など）
│   ├── hooks/               # カスタムフック
│   ├── styles/              # グローバルスタイル
│   ├── types/               # 型定義（images.d.ts等）
│   └── middleware.ts       # Next.jsミドルウェア
├── public/                  # 静的アセット
│   └── images/             # 画像（パッケージ等）
├── docs/                    # ドキュメント
│   ├── SEO.md
│   ├── SECURITY.md
│   └── RESEND_SETUP_README.md
├── scripts/                 # スクリプト
│   ├── seed-master-data.js # マスターデータ投入
│   └── reset-prisma-connection.js
├── .env.local               # 環境変数（Git管理外）
├── package.json
├── tsconfig.json
└── README.md
```

---

## 💻 開発ガイド

### データベーススキーマの変更

1. `prisma/schema.prisma`を編集
2. マイグレーションを実行：

```bash
npx prisma migrate dev --name describe_your_changes
```

3. Prisma Clientを自動生成（マイグレーション時に自動実行されます）

### 新しいAPIエンドポイントの追加

1. `src/lib/validations/`にZodスキーマを定義
2. `src/server/routers/`にtRPC Routerを追加
3. `src/server/routers/_app.ts`にRouterを登録
4. フロントエンドから`trpc.yourRouter.yourProcedure.useMutation()`で使用

### 型安全性の確保

- **Zod**: バリデーションスキーマと型定義を一元管理
- **tRPC**: クライアント・サーバー間で型を共有
- **Prisma**: データベーススキーマから型を自動生成

### ローカルでVercelのCIをテストする

PRにpushする前に、ローカルでビルドが成功するか確認できます：

```bash
# ビルドテスト（VercelのCIと同じコマンド）
npm run build
```

**注意**: ビルド時には以下の環境変数が必要です（`.env.local`に設定）：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

ビルドが成功すれば、VercelのCIでも問題なくビルドできるはずです。

**トラブルシューティング**:
- 環境変数が設定されていない場合は、`.env.local`ファイルを作成して必要な環境変数を設定してください
- `prisma generate`が失敗する場合は、`DATABASE_URL`にダミー値を設定しても問題ありません（ビルド時にはDB接続しません）

**Windowsで`EPERM: operation not permitted`エラーが発生する場合**:
このエラーは、Prismaのクライアントファイルが別のプロセス（開発サーバーやエディタ）によって使用されている場合に発生します。以下の手順で解決できます：

1. **開発サーバーを停止**: `npm run dev`を実行している場合は、`Ctrl+C`で停止してください
2. **エディタを閉じる**: VSCodeなどのエディタを一度閉じてから再試行
3. **手動でクリーンアップ**: 以下のコマンドで`.prisma`フォルダを削除してから再ビルド：
   ```bash
   # PowerShellの場合
   Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue
   npm run build
   
   # または、コマンドプロンプトの場合
   rmdir /s /q node_modules\.prisma
   npm run build
   ```
4. **管理者権限で実行**: 上記で解決しない場合は、PowerShellを管理者権限で開いてから実行

---

## 🗄 データベース設計

### ER図

https://supabase.com/dashboard/project/rypnziaqpgresqcqgkwx/database/schemas の通りです。

---

## 🔌 API仕様

### tRPC Router構造例

```
appRouter
├── auth
│   ├── register          # ユーザー新規登録
│   ├── login             # ログイン
│   ├── requestPasswordReset  # パスワードリセットリクエスト
│   └── logout            # ログアウト
└── profile
    ├── getCasterProfile      # キャストプロフィール取得
    ├── updateCasterProfile   # キャストプロフィール更新
    ├── getOrdererProfile     # 発注者プロフィール取得
    ├── updateOrdererProfile  # 発注者プロフィール更新
    └── getUserInfo           # ユーザー情報取得（両方のプロフィールを含む）
```

### 主要エンドポイント例

#### `auth.register`
- **説明**: ユーザー新規登録
- **入力**:
  ```typescript
  {
    email: string;
    password: string;
    passwordConfirm: string;
    role: "caster" | "orderer" | "both";
  }
  ```
- **出力**:
  ```typescript
  {
    success: boolean;
    user: {
      id: string;
      email: string;
      hasCasterProfile: boolean;
      hasOrdererProfile: boolean;
    };
  }
  ```

#### `profile.updateCasterProfile`
- **説明**: キャストプロフィール更新
- **入力**:
  ```typescript
  {
    userId: string;
    data: {
      fullName?: string;
      area?: string;
      occupation?: string;
    };
  }
  ```

---

## 🐛 トラブルシューティング

### Prismaエンジンのエラー

**エラー**: `Cannot use 'in' operator to search for '~standard' in undefined`

**解決方法**:
```bash
# Prisma Clientを再生成
npx prisma generate

# 開発サーバーを再起動
npm run dev
```

### データベース接続エラー

**エラー**: `Authentication failed against database server`

**解決方法**:
1. `.env.local`の`DATABASE_URL`を確認
2. パスワードに特殊文字が含まれる場合はURLエンコードが必要な場合があります
3. Supabaseダッシュボードで接続文字列を再取得

### tRPCエンドポイントが見つからない

**エラー**: `404 Not Found` または `Cannot find module`

**解決方法**:
1. `src/app/api/trpc/[trpc]/route.ts`が存在するか確認
2. 開発サーバーを再起動
3. `.next`フォルダを削除して再ビルド：
   ```bash
   rm -rf .next
   npm run dev
   ```

### マイグレーションエラー

**エラー**: `Migration failed` または `Table already exists`

**解決方法**:
1. Supabaseダッシュボードでテーブルの状態を確認
2. 必要に応じてマイグレーションをリセット：
   ```bash
   npx prisma migrate reset
   ```
   ⚠️ **注意**: これにより既存のデータが削除されます

### 環境変数が読み込まれない

**解決方法**:
1. `.env.local`ファイルがプロジェクトルートにあるか確認
2. ファイル名が`.env.local`であることを確認（`.env`ではない）
3. 開発サーバーを再起動

---

## 🔗 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Zod Documentation](https://zod.dev/)

---

© 2026 SUNNY ROCKS
