import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['apps/storefront/src/**/*.spec.ts'],
    coverage: {
      reporter: ['html', 'text', 'text-summary'],
      include: ['apps/storefront/src/**/*.ts'],
      exclude: ['apps/storefront/src/**/*.spec.ts'],
    },
  },
  //@ts-expect-error: vite-tsconfig-paths does not load correctly in type:module projects
  plugins: [tsconfigPaths.default()],
});
