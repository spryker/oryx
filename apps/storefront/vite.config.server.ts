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
    target: 'esnext',
    lib: {
      entry: 'src/entry-server.ts',
      formats: ['iife'],
      name: 'storefront',
    },
    emptyOutDir: true,
    outDir: '../../dist/apps/storefront/server',
    ssr: 'src/entry-server.ts',
  },
  ssr: {
    noExternal: ['rxjs', 'lit', 'lit-element', '@lit-labs/ssr'],
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
