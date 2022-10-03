import {
  defineConfig,
  loadEnv,
  splitVendorChunkPlugin,
  SSROptions,
} from 'vite';
import checker from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';
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
    : {};

export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), '');

  const mockServerUrl = env.FES_CONTENT_BACKEND_URL;
  const adjustedMockServerUrl = env.REVIEW_ID
    ? mockServerUrl.slice(0, 8) +
      `deploy-preview-${env.REVIEW_ID}--` +
      mockServerUrl.slice(8)
    : mockServerUrl;

  console.log('adjustedMockServerUrl: ', adjustedMockServerUrl);

  process.env = Object.assign(process.env, env, {
    FES_CONTENT_BACKEND_URL: adjustedMockServerUrl,
  });

  return {
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
