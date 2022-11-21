import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';
import checker from 'vite-plugin-checker';
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
  const envDir = process.cwd();
  const env = loadEnv(config.mode, envDir, '');

  adjustUrlVariable(env, 'FES_CONTENT_BACKEND_URL');

  return {
    esbuild,
    root: './src',
    build: {
      outDir: '../../../dist/apps/storefront/client',
      emptyOutDir: true,
    },
    ssr: {
      external: ['@lit-labs', 'rxjs'],
    },
    envDir: '../',
    publicDir: '../../../libs/presets/public',
    envPrefix: ['FES', 'SCOS', 'STORE'],
    plugins: [
      splitVendorChunkPlugin(),
      checker({
        typescript: {
          tsconfigPath: 'tsconfig.app.json',
        },
      }),
      tsconfigPaths({ root: '../../../' }),
    ],
  };
});
