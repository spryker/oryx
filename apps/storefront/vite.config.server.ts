import { defineConfig, SSROptions } from 'vite';
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
  },
  ssr: {
    noExternal: ['rxjs', 'lit', 'lit-element', '@lit-labs/ssr'],
  },
  envPrefix: ['FES_CONTENT_BACKEND_URL'],
  plugins: [tsconfigPaths({ root: '../../' })],
});
