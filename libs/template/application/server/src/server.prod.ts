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
  const { indexPath, entryPath, component, namespace } = config;

  app.use('/assets', express.static(`${indexPath}/assets`));

  app.head('/*', (req, res) => {
    res.status(200).end('');
  });

  app.get('/*', async (req, res, next) => {
    console.debug(req.url, 'prod | get request')
    const url = generateUrl(req);

    if (!url) {
      return next();
    }

    try {
      console.debug('indexFile: ', indexPath)
      const indexFile = readFileSync(`${indexPath}/index.html`, 'utf-8');
      console.debug('indexFile: ', indexFile.length)
      const template = indexFile;
      const render = serverContext({ entry: entryPath, namespace });
      console.debug('render: ', render)
      const appHtml = await render({ route: url });
      console.debug('appHtml: ', appHtml.length)
      const html = template.replace(component, appHtml);
      console.debug('html: ', html.length)

      res.status(200).end(html);
    } catch (e) {
      console.error(e);
      res.status(500).end((e as Error).message);
    }
  });
}
