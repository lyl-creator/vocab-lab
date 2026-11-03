import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
// 单文件版（vocab-lab.html）需要把所有异步 chunk 内联进主包
const inline = process.env.VITE_INLINE === '1'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: inline ? { rollupOptions: { output: { inlineDynamicImports: true } } } : {},
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
