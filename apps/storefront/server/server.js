import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from '../../../libs/storefront/server/src/server.js';

const config = {
  isProd: process.env.NODE_ENV === 'production',
  __dirname: dirname(fileURLToPath(import.meta.url)),
  prod: {
    root: '../../../dist/apps/storefront',
    entry: './server/render.js',
    index: './client',
  },
  dev: {
    root: '../',
    entry: './server/render.ts',
    index: './src',
  },
  component: '<storefront-component></storefront-component>',
};

createServer(config);
