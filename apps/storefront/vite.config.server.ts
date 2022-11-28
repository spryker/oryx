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
  const envDir = process.cwd();
  const env = loadEnv(config.mode, envDir, '');

  adjustUrlVariable(env, 'FES_CONTENT_BACKEND_URL');

  return {
    build: {
      target: 'esnext',
      lib: {
        entry: 'server/render.ts',
        formats: ['iife'],
        name: 'storefront',
      },
      emptyOutDir: true,
      outDir: '../../dist/apps/storefront/server',
      ssr: 'server/render.ts',
    },
    ssr: {
      noExternal: true,
    },
    envPrefix: ['FES', 'SCOS', 'STORE'],
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
            src: '../../libs/application/server/src/hosting/netlify.toml',
            dest: '../client',
          },
          {
            src: '../../libs/application/server/src/hosting/context.js',
            dest: '../functions/ssr',
          },
          {
            src: '../../libs/application/server/src/hosting/handler.lambda.js',
            dest: '../functions/ssr',
          },
          {
            src: '../../libs/application/server/src/hosting/handler.netlify.js',
            dest: '../functions/ssr',
            rename: 'index.js',
          },
        ],
      }),
    ],
  };
});
