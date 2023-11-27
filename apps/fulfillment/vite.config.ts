import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { version } from './package.json';

const skipSw = !!process.env.NO_SW;

export default defineConfig({
  root: './src',
  envPrefix: 'ORYX_',

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  define: {
    'import.meta.env.ORYX_APP_VERSION': JSON.stringify(version),
    __ORYX_FEATURE_VERSION__: `"${process.env.ORYX_FEATURE_VERSION ?? ''}"`,
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
      srcDir: '../dev-dist/sw',
      filename: 'app.js',
      manifest: {
        name: 'Fulfillment App',
        short_name: 'Fulfillment App',
        theme_color: '#ffffff',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/icons/logo.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf,otf}'],
      },
    }),
    tsconfigPaths({ root: '../../../' }),
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
