import express from 'express';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { createServer as createViteServer } from 'vite';
import { serverContext } from './hosting/context.js';

export async function createServer(config) {
  const app = express();
  const {
    isProd,
    [isProd ? 'prod' : 'dev']: { root, entry, index },
    component,
    __dirname,
    namespace,
  } = config;
  const rootPath = resolve(__dirname, root);
  const indexPath = join(rootPath, index);
  const entryPath = join(rootPath, entry);

  const vite = await createViteServer({
    root: indexPath,
    ...(!isProd && { configFile: `${rootPath}/vite.config.ts` }),
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
      const indexFile = readFileSync(`${indexPath}/index.html`, 'utf-8');
      const template = isProd
        ? indexFile
        : await vite.transformIndexHtml(url, indexFile);
      const render = isProd
        ? serverContext({ base: entryPath, namespace })
        : (await vite.ssrLoadModule(entryPath)).render;
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
