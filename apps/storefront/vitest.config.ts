import type { IWindow } from 'happy-dom';
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
});
