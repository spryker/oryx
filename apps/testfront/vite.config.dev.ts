import { defineConfig } from 'vite';
import { viteConfig } from './vite.config.common.js';
import { viteStaticCopy } from 'vite-plugin-static-copy';

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
