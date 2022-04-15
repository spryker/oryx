import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.ts'],
    coverage: {
      reporter: ['html', 'text', 'text-summary'],
    },
  },
  plugins: [tsconfigPaths({ root: '../../' })],
});
