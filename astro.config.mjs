import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://gkstreams.com",
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
