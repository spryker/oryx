import { defineConfig, loadEnv, SSROptions } from 'vite';
import checker from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module 'vite' {
  interface UserConfig {
    ssr?: SSROptions;
  }
}

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
      noExternal: true,
    },
    envPrefix: ['FES', 'SCOS'],
    plugins: [
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
