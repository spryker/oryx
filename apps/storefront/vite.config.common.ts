import { Plugin } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

export const viteConfig = {
  index: './src',
  // vite starts paths from index dir
  root: '../',
  envPrefix: ['ORYX', 'FES', 'SCOS', 'STORE'],
  define: {
    '__ORYX_FEATURE_LEVEL__': 'latest',
  },
  /// need additional escape because we start from './src'
  monorepoRoot: '../../../',
  ssr: {
    entry: 'render.ts',
    namespace: 'storefront',
    root: './server',
  },
  build: {
    outDirRoot: './apps/storefront/dist',
    index: './client',
    ssr: './server',
  },
  plugins: (): Plugin[] => [
    checker({
      typescript: {
        tsconfigPath: 'tsconfig.app.json',
      },
    }),
    tsconfigPaths({ root: viteConfig.monorepoRoot }) as unknown as Plugin,
  ],
};
