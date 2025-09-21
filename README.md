# Next.js Final Project — next-blog

Next.js 修了課題の成果物です。採点者が素早く動かせるよう、最小の手順を記載します。

## Quick Start
**前提**: Node.js 18+ / npm 10+

```bash
# 依存関係のインストール
npm ci || npm install

# 開発サーバ起動
npm run dev
```

ブラウザで http://localhost:3000 を開いて表示を確認してください。

## 環境変数
- `NEXT_PUBLIC_SITE_URL`: ルート絶対URL  
  - 開発時: `http://localhost:3000`  
  - 本番: Vercel デプロイURL（例: `https://<your-app>.vercel.app`）

### サンプル
`.env.example` を参考に `.env.local` を作成してください。
