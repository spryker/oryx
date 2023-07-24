import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import { Plugin } from 'vite';

const production = !process.argv.includes('--watch');

export default defineConfig(() => {
  return {
    build: {
      outDir: 'dev-dist/sw',
      lib: {
        entry: 'sw/main.ts',
        formats: ['es'],
        fileName: (format, entryName) => `${entryName}.js`,
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(
        production ? '"production"' : '"development"'
      ),
      'process.env.PROD': JSON.stringify(production),
      'process.env.DEV': JSON.stringify(!production),
      'process.env': JSON.stringify(process.env ?? {}),
    },
    plugins: [tsconfigPaths({ root: '../../' })],
  };
});
