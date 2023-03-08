import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, UserConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.ts'],
    setupFiles: [
      '../../setupTests.ts',
      '../../../tools/setup-files/user-agent.ts',
      '../../../tools/setup-files/focus-within.ts',
    ],
    coverage: {
      reporter: ['html', 'text', 'text-summary'],
      exclude: [
        '**/*mock*.ts',
        '**/feature.ts',
        '**/*.def.ts',
        '**/*.stories.ts',
        '**/*.stories/*.ts',
        '**/*.styles.ts',
        '**/*.schema.ts',
        '**/*.spec.ts',
      ],
    },
  },
  plugins: [tsconfigPaths({ root: '../../../' })],
}) as UserConfig;
