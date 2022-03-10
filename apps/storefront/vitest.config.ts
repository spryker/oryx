import type { IWindow } from 'happy-dom';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends IWindow {}
}

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['apps/storefront/**/*.spec.ts'],
  },
  //@ts-expect-error: vite-tsconfig-paths does not load correctly in type:module projects
  plugins: [tsconfigPaths.default()],
});
