import { defineConfig } from 'vite';
import { viteConfig } from './vite.config.common.js';

export default defineConfig({
  root: viteConfig.index,
  envDir: viteConfig.root,
  envPrefix: viteConfig.envPrefix,
  build: {
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
  publicDir: '../../../libs/presets/public',
  plugins: [...viteConfig.plugins()],
});
