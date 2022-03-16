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
  define: {
    __CONTENT_BACKEND_URL__: JSON.stringify(process.env.CONTENT_BACKEND_URL),
  },
  ssr: {
    external: ['@lit-labs', 'rxjs'],
  },
  plugins: [tsconfigPaths({ root: '../../' })],
});
