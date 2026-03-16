# ベースイメージには軽量な Alpine Linux 版の Node.js 22 を使用
FROM node:22-alpine

# コンテナ内の作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピーして依存関係をインストール
# 先にこれらをコピーすることで、ソースコード変更時のnpm installのキャッシュを効かせる
COPY package*.json ./
RUN npm ci

# プロジェクトの全ファイルをコピー
COPY . .

# ポート5174を開放
EXPOSE 5174

# 開発サーバーを起動
CMD ["npm", "run", "dev"]