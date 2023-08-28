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
  define: viteConfig.define,
  publicDir: '../../../libs/template/presets/public',
  plugins: [...viteConfig.plugins()],
});
