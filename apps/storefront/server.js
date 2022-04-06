import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { serverContext } from './functions/ssr/context.js';

const isProd = process.env.NODE_ENV === 'production';

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' },
  });
  app.use(vite.middlewares);

  app.get('/', async (req, res) => {
    const url = req.originalUrl;

    try {
      let template = fs.readFileSync(
        path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          'index.html'
        ),
        'utf-8'
      );
      template = await vite.transformIndexHtml(url, template);
      let render;
      if (isProd) {
        render = serverContext({ base: '../../' });
      } else {
        ({ render } = await vite.ssrLoadModule('/src/entry-server.dev.ts'));
      }
      const appHtml = await render({
        tag: 'storefront-component',
        props: {
          content: {
            banner: 'other-banner',
            banner2: 'generic-banner',
          },
        },
      });

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
