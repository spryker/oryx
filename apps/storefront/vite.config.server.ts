import { defineConfig, SSROptions } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
// import checker from 'vite-plugin-checker'

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
    // TODO: uncomment after fixing ts errors
    // checker({
    //   typescript: {
    //     tsconfigPath: 'tsconfig.app.json',
    //   },
    // }),
    tsconfigPaths({ root: '../../' }),
  ],
});
