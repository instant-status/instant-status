import reactRefresh from "@vitejs/plugin-react";
import { defineConfig } from "vite";

console.log(`Running in ${process.env.NODE_ENV} mode.`);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    port: 1234,
    ...(process.env.NODE_ENV === `development` && {
      hmr: {
        path: `/vite-ws/`,
        clientPort: 443,
      },
    }),
  },
});
