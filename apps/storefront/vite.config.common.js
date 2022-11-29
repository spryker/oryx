import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

export const viteConfig = {
  index: './src',
  // vite starts paths from index dir
  root: '../',
  envPrefix: ['FES', 'SCOS', 'STORE'],
  /// need additional escape because we start from './src'
  monorepoRoot: '../../../',
  ssr: {
    entry: 'render.ts',
    namespace: 'storefront',
    root: './server',
  },
  build: {
    outDirRoot: 'dist/apps/storefront',
    index: './client',
    ssr: './server',
  },
  plugins: () => [
    checker({
      typescript: {
        tsconfigPath: 'tsconfig.app.json',
      },
    }),
    tsconfigPaths({ root: viteConfig.monorepoRoot }),
  ],
};
