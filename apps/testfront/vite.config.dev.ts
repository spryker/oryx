import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { viteConfig } from './vite.config.common.js';

export default defineConfig({
  root: viteConfig.index,
  envDir: viteConfig.root,
  envPrefix: viteConfig.envPrefix,
  build: {
    sourcemap: true,
  },
  server: {
    port: 3001,
  },
  define: viteConfig.define,
  publicDir: '../../../libs/template/presets/public',
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: '../src/assets/addresses',
          dest: '../../dist/client/assets',
        },
      ],
    }),
  ],
});
