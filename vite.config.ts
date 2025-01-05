import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/pokemon-team-builder/", // Caminho base para GitHub Pages
  plugins: [react()],
});
