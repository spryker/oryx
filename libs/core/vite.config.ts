import copy from 'rollup-plugin-copy';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '../../dist/libs/core',
    assetsDir: '',
    rollupOptions: {
      input: {
        index: 'src/index.ts',
        'server/index': 'server/index.ts',
        'testing/index': 'testing/index.ts',
      },
      output: {
        esModule: true,
        format: 'es',
        entryFileNames: `[name].js`,
      },
      preserveEntrySignatures: 'strict',
      external: [/rxjs/, /@spryker/],
    },
    minify: 'terser',
    emptyOutDir: false,
    sourcemap: true,
  },
  plugins: [
    copy({
      targets: [
        { src: ['package.json', '*.md'], dest: '../../dist/libs/core' },
      ],
    }),
  ],
});
