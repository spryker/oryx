import { getWindow } from '@lit-labs/ssr/lib/dom-shim.js';
import '@lit-labs/ssr/lib/render-with-global-dom-shim.js';
import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createContext, Script } from 'vm';

export const serverContext = (options = {}) => {
  const server = options.base ? options.base : '../../server/entry.js';
  const url = options.url ? options.url : import.meta.url;
  const base = dirname(fileURLToPath(url));
  const window = getWindow({
    includeJSBuiltIns: true,
    props: {
      require: createRequire(url),
      Event,
      process,
    },
  });
  window.URLSearchParams = URLSearchParams;
  window.URL = URL;
  window.exports = {};
  window.setTimeout = setTimeout;
  const script = new Script(`
    ${readFileSync(resolve(base, server), 'utf8')};
    (() => storefront.render)();
  `);
  createContext(window);
  return script.runInContext(window);
};
