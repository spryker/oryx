import { join } from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { viteConfig } from './vite.config.common.js';

export default defineConfig((config) => {
  return {
    root: viteConfig.index,
    envDir: viteConfig.root,
    envPrefix: viteConfig.envPrefix,
    define: viteConfig.define,
    build: {
      outDir: join(
        viteConfig.monorepoRoot,
        viteConfig.build.outDirRoot,
        viteConfig.build.index
      ),
      emptyOutDir: true,
    },
    publicDir: '../../../libs/template/presets/public',
    plugins: [
      ...viteConfig.plugins(),
      splitVendorChunkPlugin(),
      createHtmlPlugin({
        minify: true,
        pages: [
          {
            entry: 'src/app.ts',
            filename: 'index.html',
            template: 'public/index.html',
            injectOptions: {
              data: {
                title: 'index',
                injectScript: `<script src="./inject.js"></script>`,
              },
              tags: [
                {
                  injectTo: 'body-prepend',
                  tag: 'div',
                  attrs: {
                    id: 'tag1',
                  },
                },
              ],
            },
          },
        ],
      }),
    ],
  };
});
