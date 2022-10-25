import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';
import { adjustUrlVariable } from '../../tools/utils/adjustUrlVariable';

declare module 'vite' {
  interface UserConfig {
    ssr?: SSROptions;
  }
}

export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), '');

  adjustUrlVariable(env, 'FES_CONTENT_BACKEND_URL');

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
