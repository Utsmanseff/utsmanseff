import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    // Agent worktrees under .claude are full copies of this repo. Left in, vitest
    // runs their stale duplicates alongside the real suite and reports the total
    // as if it were this branch's.
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/.claude/**'],
    setupFiles: ['./vitest.setup.js'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
