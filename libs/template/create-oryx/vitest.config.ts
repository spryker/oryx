import { defineConfig } from 'vitest/config';
import config from '../../vitest.config';

export default defineConfig({
  ...config,
  test: {
    ...config.test,
    environment: 'node',
    setupFiles: [],
  },
});
