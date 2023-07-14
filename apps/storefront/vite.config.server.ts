import { join } from 'path';
import { defineConfig, UserConfig } from 'vite';
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
    plugins: [...viteConfig.plugins()],
  } as UserConfig;
});
