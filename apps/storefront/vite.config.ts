import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module 'vite' {
  interface UserConfig {
    ssr: {
      external: string[];
    };
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../../dist/apps/storefront/client',
    emptyOutDir: true,
  },
  ssr: {
    external: ['@lit-labs', 'rxjs'],
  },
  envPrefix: ['CONTENT_BACKEND_URL'],
  plugins: [tsconfigPaths({ root: '../../' })],
});
