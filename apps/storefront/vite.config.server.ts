import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/app.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: /^lit/,
    },
    emptyOutDir: true,
  },
  plugins: [tsconfigPaths({ root: '../../' })],
});
