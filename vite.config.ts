import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ isSsrBuild }) => ({
  // Tailwind only needed for the client CSS build, not the SSR bundle
  plugins: isSsrBuild ? [react()] : [react(), tailwindcss()],
  build: {
    // Client build → dist/   SSR build → .ssr-temp/ (cleaned up after prerender)
    outDir: isSsrBuild ? ".ssr-temp" : "dist",
  },
}));
