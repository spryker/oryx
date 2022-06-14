import { builder } from '@netlify/functions';
import * as fs from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { serverContext } from './context';

const storefrontHandler = async (event, context) => {
  try {
    const originalUrl = new URL(event.rawUrl);

    // esbuild on netlify does not properly transform import.meta because it is not using esnext settings
    const url = 'file:///var/task/dist/apps/storefront/functions/ssr/index.js';
    const basepath = dirname(fileURLToPath(url));
    const template = fs.readFileSync(
      resolve(basepath, '../../client/index.html'),
      'utf8'
    );
    const render = serverContext({
      url,
    });
    const appHtml = await render({ route: originalUrl });
    const html = template.replace(
      `<storefront-component></storefront-component>`,
      appHtml
    );
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

const handler = builder(storefrontHandler);

export { handler };
