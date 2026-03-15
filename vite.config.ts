//import { defineConfig } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // ブラウザ環境をエミュレートする
    globals: true, // describe や it をインポートなしで使えるようにする（オプションですが便利です）
  },
});
