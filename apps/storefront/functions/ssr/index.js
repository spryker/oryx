import * as fs from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { serverContext } from './context';

export async function handler(event, context) {
  try {
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
    const appHtml = await render();
    const html = template.replace(
      `<storefront-component></storefront-component>`,
      appHtml
    );
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
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
}
