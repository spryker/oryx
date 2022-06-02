import { defineConfig } from 'vitest/config';
import config from '../vitest.config';

export default defineConfig({
  ...config,
  test: {
    ...config.test,
    coverage: {
      ...config.test?.coverage,
      exclude: [...(config.test?.coverage?.exclude ?? []), '**/testing/*'],
    },
  },
});
