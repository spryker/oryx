import { join } from 'path';
import { defineConfig } from 'vite';
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
      viteConfig.monorepoRoot,
      viteConfig.build.outDirRoot,
      'functions/ssr'
    ),
    rollupOptions: {
      external: ['fs', 'path', 'url', 'module', 'vm', /^node/, /^@netlify/],
    },
    define: viteConfig.define,
  },
  plugins: [...viteConfig.plugins()],
});
