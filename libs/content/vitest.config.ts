import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.ts'],
  },
  plugins: [tsconfigPaths({ root: '../../' })],
});
