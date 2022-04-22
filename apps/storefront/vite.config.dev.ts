import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  envPrefix: ['FES', 'SCOS'],
  build: {
    sourcemap: true,
  },
  plugins: [
    tsconfigPaths({ root: '../../' }),
    viteStaticCopy({
      targets: [
        {
          src: '../../libs/ui/public/assets/*.*',
          dest: 'assets',
        },
      ],
    }),
  ],
});
