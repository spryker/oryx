import copy from 'rollup-plugin-copy';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  // mode: 'development',
  build: {
    outDir: '../../dist/libs/lit-rxjs',
    rollupOptions: {
      external: [/^lit/, 'rxjs'],
    },
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    sourcemap: true,
  },
  plugins: [
    tsconfigPaths({ root: '../../' }),
    copy({
      targets: [
        { src: ['package.json', '*.md'], dest: '../../dist/libs/lit-rxjs' },
      ],
    }),
  ],
});
