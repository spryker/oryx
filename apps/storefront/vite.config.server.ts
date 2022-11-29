import { join } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { adjustEnv } from '../../tools/utils/adjustUrlVariable';
import { viteConfig } from './vite.config.common.js';

export default defineConfig((config) => {
  adjustEnv(config);

  return {
    root: viteConfig.index,
    envDir: viteConfig.root,
    envPrefix: viteConfig.envPrefix,
    build: {
      target: 'esnext',
      lib: {
        entry: join(viteConfig.root, viteConfig.ssr.root, viteConfig.ssr.entry),
        formats: ['iife'],
        name: viteConfig.ssr.namespace,
      },
      emptyOutDir: true,
      outDir: join(
        viteConfig.monorepoRoot,
        viteConfig.build.outDirRoot,
        viteConfig.build.ssr
      ),
      ssr: viteConfig.ssr.entry,
    },
    ssr: {
      noExternal: true,
    },
    plugins: [
      ...viteConfig.plugins(),
      viteStaticCopy({
        targets: [
          {
            src: '../../../libs/application/server/src/hosting/netlify.toml',
            dest: '../client',
          },
          {
            src: '../../../libs/application/server/src/hosting/context.js',
            dest: '../functions/ssr',
          },
          {
            src: '../../../libs/application/server/src/hosting/handler.lambda.js',
            dest: '../functions/ssr',
          },
          {
            src: '../../../libs/application/server/src/hosting/handler.netlify.js',
            dest: '../functions/ssr',
            rename: 'index.js',
          },
        ],
      }),
    ],
  };
});
