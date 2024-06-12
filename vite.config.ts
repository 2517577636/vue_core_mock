import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

function getBaseDirUrl(base: string = ".././packages") {
  return path.resolve(fileURLToPath(import.meta.url), base);
}

const url = getBaseDirUrl();
console.log("url: ", url);

export default defineConfig({
  resolve: {
    alias: {
      "@packages": getBaseDirUrl(),
      "@": getBaseDirUrl("./src"),
    },
  },
  server: {
    port: 5500,
    open: true,
  },
});
