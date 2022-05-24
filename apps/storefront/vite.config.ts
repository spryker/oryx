import { defineConfig, SSROptions } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module 'vite' {
  interface UserConfig {
    ssr?: SSROptions;
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../../dist/apps/storefront/client',
    emptyOutDir: true,
  },
  ssr: {
    external: ['@lit-labs', 'rxjs'],
  },
  envPrefix: ['FES', 'SCOS'],
  plugins: [
    checker({
      typescript: {
        tsconfigPath: 'tsconfig.app.json',
      },
    }),
    tsconfigPaths({ root: '../../' }),
  ],
});
