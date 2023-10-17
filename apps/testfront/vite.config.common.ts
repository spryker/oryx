export const viteConfig = {
  index: './src',
  // vite starts paths from index dir
  root: '../',
  envPrefix: ['ORYX', 'FES', 'SCOS', 'STORE'],
  define: {
    __ORYX_FEATURE_VERSION__: `"${process.env.ORYX_FEATURE_VERSION ?? ''}"`,
  },
  ssr: {
    entry: 'render.ts',
    namespace: 'testfront',
    root: './server',
  },
  build: {
    outDirRoot: '../dist',
    index: './client',
    ssr: './server',
  },
};
