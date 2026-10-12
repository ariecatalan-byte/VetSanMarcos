import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" permite publicar la carpeta dist en cualquier hosting estático
// (GitHub Pages, servidor local, etc.) sin configurar rutas absolutas.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
