import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { version } from './package.json';

const skipSw = !!process.env.NO_SW;

export default defineConfig({
  root: '.',
  envPrefix: 'ORYX_',
  build: {
    outDir: '../../dist/apps/fulfillment-app',
    emptyOutDir: true,
    sourcemap: true,
  },
  define: {
    'import.meta.env.ORYX_FULFILLMENT_APP_VERSION': JSON.stringify(version),
  },

  server: {
    port: 4200,
    host: 'localhost',
  },

  plugins: [
    VitePWA({
      devOptions: { enabled: !skipSw, type: 'module' },
      registerType: 'prompt',
      injectRegister: 'auto',
      strategies: 'injectManifest',
      srcDir: 'dev-dist/sw',
      filename: 'main.js',
      manifest: {
        name: 'Fulfillment App',
        short_name: 'Fulfillment App',
        theme_color: '#ffffff',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            purpose: 'maskable',
            src: '/icons/android-chrome-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            purpose: 'maskable',
            src: '/icons/android-chrome-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf,otf}'],
      },
    }),
    tsconfigPaths({ root: '../../' }),
    checker({
      typescript: {
        tsconfigPath: 'tsconfig.app.json',
      },
    }),
  ],

  // Uncomment this if you are using WebWorkers
  // worker: {
  //   format: 'es',
  //   plugins: [tsconfigPaths({ root: '../../' })],
  // },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
