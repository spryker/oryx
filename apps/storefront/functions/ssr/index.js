import * as fs from 'fs';
import { serverContext } from './context';

export async function handler(event, context) {
  try {
    const template = fs.readFileSync(
      './dist/apps/storefront/client/index.html',
      'utf8'
    );
    const render = serverContext({
      // esbuild on netlify does not properly transform import.meta because it is not using esnext settings
      url: 'file:///var/task/apps/storefront/functions/ssr/index.js',
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
