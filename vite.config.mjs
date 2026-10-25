import { defineConfig, transformWithOxc } from "vite";
import react from "@vitejs/plugin-react";

// Keep the existing .js JSX sources and React 16 classic runtime across dev,
// browser builds, tests and the server-side prerender source loader.
export default defineConfig(({ command }) => ({
  base: "/",
  plugins: [
    {
      name: "site-jsx-in-js",
      enforce: "pre",
      configResolved(config) {
        // plugin-react includes automatic-JSX entrypoints even in classic mode.
        // Remove only these nonexistent React16 entrypoints before optimization.
        config.optimizeDeps.include = config.optimizeDeps.include.filter(
          (id) => id !== "react/jsx-runtime" && id !== "react/jsx-dev-runtime"
        );
      },
      transform(code, id) {
        if (!/\/src\/.*\.js$/.test(id.replace(/\\/g, "/"))) return;
        return transformWithOxc(code, id, {
          lang: "jsx",
          jsx: {
            runtime: "classic",
            development: command === "serve",
            // This .js adapter uses Vite's full-reload fallback on edits.
            // Do not emit unwrapped Fast Refresh registration calls.
            refresh: false,
          },
        });
      },
    },
    react({ jsxRuntime: "classic" }),
  ],
  optimizeDeps: {
    rolldownOptions: {
      moduleTypes: { ".js": "jsx" },
      transform: { jsx: { runtime: "classic" } },
    },
  },
  build: {
    outDir: "build",
    // Retain a conservative syntax baseline instead of Vite's moving default.
    // All browsers in the retained Browserslist policy support native modules.
    target: "es2015",
  },
  test: {
    globals: true,
    environment: "jsdom",
    environmentOptions: { jsdom: { url: "http://localhost/", pretendToBeVisual: true } },
    include: ["src/**/*.test.js"],
    fileParallelism: false,
  },
}));
