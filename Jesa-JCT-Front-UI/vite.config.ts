import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/", // chemins relatifs (important pour Azure)
  build: {
    outDir: "dist",            // sortie dans dist
    assetsDir: "assets",       // sous-dossier pour les assets
    chunkSizeWarningLimit: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5106',
        changeOrigin: true,
      },
    },
  },
});
