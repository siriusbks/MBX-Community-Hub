import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@ui": path.resolve(__dirname, "./src/components/ui"),
      "@utils": path.resolve(__dirname, "./src/components/utils"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@const": path.resolve(__dirname, "./src/const"),
        },
    },
    optimizeDeps: {
        exclude: [],
    },
    define: {
        __APP_VERSION__: JSON.stringify(Date.now()),
    },
    build: {
        target: "es2017",
        sourcemap: false,
    },
    server: {
        fs: {
            strict: false,
        },
    },
});
