import { defineConfig, splitVendorChunkPlugin, SSROptions } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module 'vite' {
  interface UserConfig {
    ssr?: SSROptions;
  }
}

const esbuild =
  process.env.NODE_ENV === 'production'
    ? {
        mangleProps: /_\$needsHydration/,
        mangleCache: {
          _$needsHydration: '_$AG',
        },
      }
    : {
        define: {
          global: 'global',
        },
      };

// https://vitejs.dev/config/
export default defineConfig({
  esbuild,
  build: {
    outDir: '../../dist/apps/storefront/client',
    emptyOutDir: true,
  },
  ssr: {
    external: ['@lit-labs', 'rxjs'],
  },
  envPrefix: ['FES', 'SCOS'],
  plugins: [
    splitVendorChunkPlugin(),
    checker({
      typescript: {
        tsconfigPath: 'tsconfig.app.json',
      },
    }),
    tsconfigPaths({ root: '../../' }),
  ],
});
