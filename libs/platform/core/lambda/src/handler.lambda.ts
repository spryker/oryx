/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { serverContext } from './context';

interface HandlerContext {
  index?: string;
  component?: string;
  entry?: string;
  root?: string;
}

export const storefrontHandler = async (
  event: any,
  context: HandlerContext
): Promise<any> => {
  try {
    const {
      root = 'file:///var/task/dist/apps/storefront/functions/ssr/index.js',
      index = '../../client/index.html',
      component = '<root-app></root-app>',
      entry = '../../server/render.js',
    } = context;
    const originalUrl = new URL(event.rawUrl);
    const basePath = dirname(fileURLToPath(root));
    const template = readFileSync(resolve(basePath, index), 'utf8');
    const render = serverContext({
      root,
      entry,
    });
    const appHtml = await render({ route: originalUrl });
    const html = template.replace(component, appHtml);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        ...event.headers,
      },
      body: html,
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: e }),
    };
  }
};
