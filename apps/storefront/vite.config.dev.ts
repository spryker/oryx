import { join } from 'path';
import { defineConfig } from 'vite';
import { viteConfig } from './vite.config.common.js';

export default defineConfig((config) => ({
  root: viteConfig.index,
  envDir: viteConfig.root,
  envPrefix: viteConfig.envPrefix,
  build: {
    outDir: join(
      viteConfig.monorepoRoot,
      viteConfig.build.outDirRoot,
      viteConfig.build.index
    ),
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
  define: viteConfig.define,
  publicDir: '../../../libs/template/presets/public',
  plugins: [...viteConfig.plugins(config)],
}));
