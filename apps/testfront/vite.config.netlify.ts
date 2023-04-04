import { join } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { viteConfig } from './vite.config.common.js';

export default defineConfig({
  root: viteConfig.index,
  build: {
    lib: {
      entry: join(viteConfig.root, viteConfig.ssr.root, './hosting/netlify.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    emptyOutDir: true,
    outDir: join(
      viteConfig.build.outDirRoot,
      'functions/ssr'
    ),
    rollupOptions: {
      external: ['fs', 'path', 'url', 'module', 'vm', /^node/, /^@netlify/],
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: '../server/hosting/netlify.toml',
          dest: '../../client',
        },
      ],
    }),
  ],
});
