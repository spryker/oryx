import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';
// import checker from 'vite-plugin-checker'

export default defineConfig({
  envPrefix: ['FES', 'SCOS'],
  build: {
    sourcemap: true,
  },
  plugins: [
    // TODO: uncomment after fixing ts errors
    // checker({
    //   typescript: {
    //     tsconfigPath: 'tsconfig.app.json',
    //   },
    // }),
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
