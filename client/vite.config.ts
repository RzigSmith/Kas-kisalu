import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": "http://0.0.0.0:5000",
      "/admin": "http://0.0.0.0:5000",
      "/projects": "http://0.0.0.0:5000"
    }
  }
});
