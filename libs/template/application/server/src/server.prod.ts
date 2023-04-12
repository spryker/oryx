import express, { Express } from 'express';
import { readFileSync } from 'fs';
// Relative path between packages is need because `ts-node` has an issue with complex paths e.g. (organization/package/subpackage)
import { serverContext } from '../../lambda/src/context';
import { ServerModeConfig } from './server.model';
import { generateUrl } from './utilities';

export async function createProdSever(
  app: Express,
  config: ServerModeConfig
): Promise<void> {
  const { indexPath, entryPath, namespace } = config;

  app.use('/assets', express.static(`${indexPath}/assets`));

  app.head('/*', (req, res) => {
    res.status(200).end('');
  });

  app.get('/*', async (req, res, next) => {
    const route = generateUrl(req);

    if (!route) {
      return next();
    }

    try {
      const template = readFileSync(`${indexPath}/index.html`, 'utf-8');
      const render = serverContext({ entry: entryPath, namespace });
      const html = await render({ route, template });

      res.status(200).end(html);
    } catch (e) {
      console.error(e);
      res.status(500).end((e as Error).message);
    }
  });
}
