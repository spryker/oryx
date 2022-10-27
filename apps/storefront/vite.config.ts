import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';
import checker from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';
import { adjustUrlVariable } from '../../tools/utils/adjustUrlVariable';

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
    : {};

export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), '');

  adjustUrlVariable(env, 'FES_CONTENT_BACKEND_URL');

  return {
    esbuild,
    build: {
      outDir: '../../dist/apps/storefront/client',
      emptyOutDir: true,
    },
    ssr: {
      external: ['@lit-labs', 'rxjs'],
    },
    envPrefix: ['FES', 'SCOS', 'STORE'],
    plugins: [
      splitVendorChunkPlugin(),
      checker({
        typescript: {
          tsconfigPath: 'tsconfig.app.json',
        },
      }),
      tsconfigPaths({ root: '../../' }),
      viteStaticCopy({
        targets: [
          {
            src: '../../libs/storefront/public/assets/icons.svg',
            dest: './assets',
          },
        ],
      }),
    ],
  };
});
