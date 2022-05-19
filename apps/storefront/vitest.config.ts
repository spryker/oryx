import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['./src/**/*.spec.ts'],
    coverage: {
      reporter: ['html', 'text', 'text-summary'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts'],
    },
  },
  plugins: [
    tsconfigPaths({
      root: '../../',
    }),
  ],
});
