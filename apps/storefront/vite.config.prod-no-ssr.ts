import { defineConfig } from 'vite';
import { viteConfig } from './vite.config.common.js';

export default defineConfig({
  root: viteConfig.index,
  envDir: viteConfig.root,
  envPrefix: viteConfig.envPrefix,
  server: {
    port: 3001,
  },
  publicDir: '../../../libs/template/presets/public',
  plugins: [...viteConfig.plugins()],
});
