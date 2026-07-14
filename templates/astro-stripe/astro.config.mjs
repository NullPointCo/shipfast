import { defineConfig } from "astro/config";
import node from "@astrojs/node";

// Server-rendered Astro app (needed for Stripe API routes).
// `npm run build` produces ./dist/server/entry.mjs (run with `npm start`).
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  server: { port: 3000, host: true },
});
