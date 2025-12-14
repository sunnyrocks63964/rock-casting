# Resend メール送信設定ガイド

このガイドでは、Resendを使用してメール送信機能を設定する手順を説明します。

## 📋 目次

1. [Resendアカウントの作成とAPIキーの取得](#1-resendアカウントの作成とapiキーの取得)
3. [環境変数の設定](#3-環境変数の設定)
4. [動作確認](#4-動作確認)

---

## 1. Resendアカウントの作成とAPIキーの取得

### ステップ1: アカウント作成

1. [https://resend.com](https://resend.com) にアクセス
2. **"Log in"** をクリックしてログインする
3. ログインmailとPWは管理者に確認する
3. メール確認を完了

### ステップ2: 既存のAPIキーの取得

1. 左側メニューから **"API Keys"** をクリック
2. 既存のAPIキー一覧が表示されます
3. 使用したいAPIキーの右側にある **"Show"** または **"Copy"** ボタンをクリック
4. APIキーをコピー（`re_` で始まる文字列）
   - ⚠️ APIキーは機密情報のため、安全に管理してください

---


## 2. 環境変数の設定

### ローカル環境（.env.local）

プロジェクトのルートディレクトリに `.env.local` ファイルを作成または編集：

```bash
RESEND_API_KEY=re_your_api_key_here // 管理者に確認
RESEND_FROM_EMAIL=noreply@sunnyrocks32169.com
```

### 本番環境（Vercel）

1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. 環境変数の確認：https://vercel.com/sunnyrocks-projects/rock-casting/settings/environment-variables

---

## 4. 動作確認

### ローカル環境

1. 開発サーバーを起動：
   ```bash
   npm run dev
   ```

2. パスワードリセットページでテスト：
   - `http://localhost:3000/reset-password` を開く
   - DBに登録されているメールアドレスを入力
      - ※DBに登録されているメールアドレスに `noreply@sunnyrocks32169.com` から実際にメールが送信されます。
   - **"再設定メールを送信"** をクリック

3. メールを確認：
   - 入力したメールアドレスの受信トレイを確認
   - `noreply@sunnyrocks32169.com` からメールが届いていることを確認

### 本番環境

本番環境でも同様に、DBに登録されているメールアドレスに `noreply@sunnyrocks32169.com` からメールが送信されます。

---

## メール送信の仕組み

- **送信元**: `noreply@sunnyrocks32169.com`（ローカル・本番共通）
- **送信先**: DBに登録されているメールアドレス
- **送信方法**: Resend APIを使用
- **必要な設定**: DNSレコード（DKIM、SPF）の設定とドメイン検証

---

## 参考リンク

- [Resend公式サイト](https://resend.com)
- [Resend Documentation](https://resend.com/docs)
