import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  define: {
    global: {},
  },
  envPrefix: ['FES', 'SCOS'],
  build: {
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
  plugins: [
    checker({
      typescript: {
        tsconfigPath: 'tsconfig.app.json',
      },
    }),
    tsconfigPaths({ root: '../../' }),
    viteStaticCopy({
      targets: [
        {
          src: '../../libs/storefront/public/assets/icons.svg',
          dest: './assets',
        },
      ],
    }),
  ],
});
