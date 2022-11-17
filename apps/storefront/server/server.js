import express from 'express';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { serverContext } from '../functions/ssr/context.js';

const config = {
  isProd: process.env.NODE_ENV === 'production',
  __dirname: dirname(fileURLToPath(import.meta.url)),
  prod: {
    root: '../../dist/apps/storefront/client/',
    entry: '../../dist/apps/storefront/server/entry.js',
  },
  dev: {
    root: '../',
    entry: '/server/entry.ts',
  },
  component: '<storefront-component></storefront-component>',
};

export async function createServer(config) {
  const app = express();
  const { isProd, prod, dev, component, __dirname } = config;
  const root = isProd ? prod.root : dev.root;

  const vite = await createViteServer({
    root: resolve(__dirname, root),
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
  });
  app.use(vite.middlewares);

  app.get('/*', async (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith('/node_modules')) {
      return next();
    }

    const originalUrl = new URL(
      `${req.protocol}://${req.headers.host}${req.originalUrl}`
    );

    try {
      let template = readFileSync(
        resolve(__dirname, `${root}index.html`),
        'utf-8'
      );
      let render;
      if (isProd) {
        render = serverContext({
          base: prod.entry,
        });
      } else {
        template = await vite.transformIndexHtml(url, template);
        ({ render } = await vite.ssrLoadModule(dev.entry));
      }
      const appHtml = await render({ route: originalUrl });

      const html = template.replace(component, appHtml);
      res.status(200).end(html);
    } catch (e) {
      // If an error is caught, let Vite fix the stracktrace so it maps back to
      // your actual source code.
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(3001, () => {
    console.log('listening on port 3001');
  });
}

createServer(config);
