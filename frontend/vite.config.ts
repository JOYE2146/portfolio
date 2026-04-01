import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    dedupe: ['firebase', '@firebase/app'],
  },
  /**
   * Firebase: only list `firebase/*` entrypoints your app imports. Listing both
   * `firebase/x` and `@firebase/x` can produce overlapping optimizer graphs and
   * “504 Outdated Optimize Dep” when one chunk invalidates the other.
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
  },
}))
