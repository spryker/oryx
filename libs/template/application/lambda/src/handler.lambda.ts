/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, existsSync } from 'fs';
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
      root = 'file:///var/task/apps/storefront/dist/functions/ssr/index.js',
      index = '../../client/index.html',
      entry = '../../server/render.js',
    } = context;
    const originalUrl = new URL(event.rawUrl);
    const basePath = dirname(fileURLToPath(root));

    console.log(context)
    console.log(basePath)
    
    console.log(__filename)
    console.log(__dirname)

    console.log(existsSync(__filename))
    console.log(existsSync(root))
    
    console.log(existsSync(resolve(__dirname, index)))
    console.log(existsSync(resolve(basePath, index)))
    
    console.log(existsSync(resolve(__dirname, entry)))
    console.log(existsSync(resolve(basePath, entry)))

    const template = readFileSync(resolve(basePath, index), 'utf8');
    const render = serverContext({
      root,
      entry,
    });
    const html = await render({ route: originalUrl, template });

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
