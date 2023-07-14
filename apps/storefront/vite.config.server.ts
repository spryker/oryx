import { join } from 'path';
import { defineConfig, UserConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { viteConfig } from './vite.config.common.js';

export default defineConfig(() => {
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
      rollupOptions: {
        output: {
          globals: {
            buffer: 'buffer',
          },
        },
      },
    },
    ssr: {
      noExternal: true,
    },
    plugins: [
      ...viteConfig.plugins(),
      viteStaticCopy({
        targets: [
          {
            src: '../../../libs/template/application/server/src/hosting/dom-shim.js',
            dest: '../functions/ssr',
          },
          {
            src: '../../../libs/template/application/server/src/hosting/context.js',
            dest: '../functions/ssr',
          },
          {
            src: '../../../libs/template/application/server/src/hosting/handler.lambda.js',
            dest: '../functions/ssr',
          },
        ],
      }),
    ],
  } as UserConfig;
});
