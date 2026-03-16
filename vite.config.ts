import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Dockerコンテナ外（ホストマシン）からのアクセスを許可
    port: 5174, // Viteのデフォルトポートを5174に変更（Docker環境での競合を避けるため）
    watch: {
      usePolling: true, // Docker環境（特にWindows/Mac）でのファイル変更検知を確実にするため
    },
  },
  test: {
    environment: "jsdom", // ブラウザ環境をエミュレートする
    globals: true, // describe や it をインポートなしで使えるようにする（オプションですが便利です）
  },
});
