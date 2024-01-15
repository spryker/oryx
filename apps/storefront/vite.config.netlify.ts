import { join } from 'path';
import { defineConfig } from 'vite';
import { viteConfig } from './vite.config.common.js';

export default defineConfig((config) => ({
  root: viteConfig.index,
  define: viteConfig.define,
  build: {
    lib: {
      entry: join(viteConfig.root, viteConfig.ssr.root, './hosting/netlify.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    emptyOutDir: true,
    outDir: join(
      viteConfig.monorepoRoot,
      viteConfig.build.outDirRoot,
      'functions/ssr'
    ),
    rollupOptions: {
      external: ['fs', 'path', 'url', 'module', 'vm', /^node/, /^@netlify/],
    },
  },
  plugins: [...viteConfig.plugins(config)],
}));
