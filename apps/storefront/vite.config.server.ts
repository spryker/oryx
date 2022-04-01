import { defineConfig, SSROptions } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module 'vite' {
  interface UserConfig {
    ssr?: SSROptions;
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'server',
  build: {
    target: 'esnext',
    lib: {
      entry: 'src/entry-server.ts',
      formats: ['es'],
    },
    emptyOutDir: true,
  },
  ssr: {
    noExternal: ['rxjs', 'lit'],
  },
  envPrefix: ['CONTENT_BACKEND_URL'],
  plugins: [tsconfigPaths({ root: '../../' })],
});
