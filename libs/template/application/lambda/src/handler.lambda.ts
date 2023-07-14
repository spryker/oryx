/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { serverContext } from './context';

interface HandlerContext {
  index?: string;
  entry?: string;
  root?: string;
  /**
   * Time to live (in seconds) option that allows you to set a fixed duration of time
   * after which a cached builder response is invalidated.
   * Also it's possible to set it with env global variable `ORYX_TTL`.
   */
  ttl?: number;
  [key: string]: any;
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
      ttl,
    } = context;
    const originalUrl = new URL(event.rawUrl);
    const basePath = dirname(fileURLToPath(root));
    const template = readFileSync(resolve(basePath, index), 'utf8');
    const render = serverContext({
      root,
      entry,
    });
    const body = await render({ route: originalUrl, template });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        ...event.headers,
      },
      body,
      ttl: process.env.ORYX_TTL ? Number(process.env.ORYX_TTL) : ttl,
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: 404,
      body: JSON.stringify(e),
    };
  }
};
