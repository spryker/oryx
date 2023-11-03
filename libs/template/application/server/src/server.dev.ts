import { Express } from 'express';
import { readFileSync } from 'fs';
import { createServer as createViteServer } from 'vite';
import { ServerModeConfig } from './server.model';
import { generateUrl } from './utilities';

export async function createDevSever(
  app: Express,
  config: ServerModeConfig
): Promise<void> {
  const { indexPath, rootPath, entryPath } = config;
  const vite = await createViteServer({
    root: indexPath,
    configFile: `${rootPath}/vite.config.ts`,
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.head('/*', (req, res) => {
    res.status(200).end('');
  });

  app.get('/*', async (req, res, next) => {
    const route = generateUrl(req);

    if (!route) return next();

    try {
      const template = readFileSync(`${indexPath}/index.html`, 'utf-8');
      const { render } = await vite.ssrLoadModule(entryPath);
      const html = await render({ route, template });

      res.status(200).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      console.error(e);
      res.status(500).end((e as Error).message);
    }
  });
}
