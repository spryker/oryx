import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../../dist/apps/storefront/client',
    emptyOutDir: true,
  },
  //@ts-ignore
  ssr: {
    external: ['@lit-labs', 'rxjs'],
  },
  plugins: [tsconfigPaths({ root: '../../' })],
});
