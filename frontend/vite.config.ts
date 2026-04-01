import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

const yamlBrowser = fileURLToPath(new URL('./node_modules/yaml/browser/index.js', import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      /** Pin browser build — stable with `optimizeDeps.exclude: ['yaml']` below. */
      yaml: yamlBrowser,
    },
    dedupe: ['firebase', '@firebase/app'],
  },
  /**
   * Firebase: only list `firebase/*` entrypoints your app imports. Listing both
   * `firebase/x` and `@firebase/x` can produce overlapping optimizer graphs and
   * “504 Outdated Optimize Dep” when one chunk invalidates the other.
   *
   * `yaml` is excluded from pre-bundling: merging it into `.vite/deps/yaml.js`
   * often triggers “504 Outdated Optimize Dep” when optimize hashes change (HMR,
   * `npm i`, sync tools touching `node_modules`). Serving native ESM from
   * `yaml/browser/**` avoids that dep cache entirely in dev.
   *
   * `force: true` during `vite` (dev) rebuilds `.vite/deps` every server start so
   * stale hashes (common after `npm i` or OneDrive touching `node_modules`) don’t
   * 504 the browser. Production `vite build` ignores `optimizeDeps.force`.
   */
  optimizeDeps: {
    force: command === 'serve',
    include: [
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/analytics',
    ],
    exclude: ['yaml'],
  },
  build: {
    /** Mermaid remains large even when split; diagrams load on demand in `MermaidBlock`. */
    chunkSizeWarningLimit: 2600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('mermaid')) return 'mermaid';
          if (id.includes('pdf-lib')) return 'pdf-lib';
          if (id.includes('framer-motion')) return 'framer-motion';
          if (id.includes('@emailjs')) return 'emailjs';
          if (id.includes('firebase') || id.includes('@firebase')) return 'firebase';
          if (id.includes('react-syntax-highlighter') || id.includes('refractor')) {
            return 'syntax-highlighter';
          }
          if (
            id.includes('react-markdown') ||
            id.includes('micromark') ||
            id.includes('unified') ||
            id.includes('mdast') ||
            id.includes('remark') ||
            id.includes('rehype')
          ) {
            return 'markdown';
          }
        },
      },
    },
  },
}))
