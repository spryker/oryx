import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['libs/experience/**/*.spec.ts'],
  },
  plugins: [tsconfigPaths()],
});
