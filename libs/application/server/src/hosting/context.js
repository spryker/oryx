import {
  getWindow,
  installWindowOnGlobal,
} from '@lit-labs/ssr/lib/dom-shim.js';
import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createContext, Script } from 'vm';

installWindowOnGlobal();

export const serverContext = (options) => {
  const server = options.base ?? '../../server/render.js';
  const url = options.url ?? import.meta.url;
  const namespace = options.namespace ?? 'storefront';
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
    (() => ${namespace}.render)();
  `);
  createContext(window);
  return script.runInContext(window);
};
