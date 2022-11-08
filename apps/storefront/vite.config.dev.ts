import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  envPrefix: ['FES', 'SCOS', 'STORE'],
  build: {
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
  plugins: [
    checker({
      typescript: {
        tsconfigPath: 'tsconfig.app.json',
      },
    }),
    tsconfigPaths({ root: '../../' }),
  ],
});
