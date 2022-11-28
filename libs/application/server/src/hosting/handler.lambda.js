import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { serverContext } from './context';

export const storefrontHandler = async (event, context) => {
  try {
    const originalUrl = new URL(event.rawUrl);
    // esbuild on netlify does not properly transform import.meta because it is not using esnext settings
    const url = 'file:///var/task/dist/apps/storefront/functions/ssr/index.js';
    const basePath = dirname(fileURLToPath(url));
    const template = readFileSync(
      resolve(basePath, '../../client/index.html'),
      'utf8'
    );
    const render = serverContext({
      url,
    });
    const appHtml = await render({ route: originalUrl });
    const html = template.replace(`<root-app></root-app>`, appHtml);
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
