import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['libs/experience/**/*.spec.ts'],
  },
  //@ts-expect-error: vite-tsconfig-paths does not load correctly in type:module projects
  plugins: [tsconfigPaths.default()],
});
