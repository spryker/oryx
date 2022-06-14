import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { serverContext } from './context.js';

const isProd = process.env.NODE_ENV === 'production';

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    root: isProd ? '../../dist/apps/storefront/client/' : './',
    server: {
      middlewareMode: 'ssr',
    },
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
      let template = fs.readFileSync(
        path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          `${isProd ? '../../dist/apps/storefront/client/' : './'}index.html`
        ),
        'utf-8'
      );
      let render;
      if (isProd) {
        render = serverContext({
          base: '../../dist/apps/storefront/server/entry-server.js',
        });
      } else {
        template = await vite.transformIndexHtml(url, template);
        ({ render } = await vite.ssrLoadModule('/src/entry-server.dev.ts'));
      }
      const appHtml = await render({ route: originalUrl });

      const html = template.replace(
        `<storefront-component></storefront-component>`,
        appHtml
      );
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

createServer();
