import { getWindow } from '@lit-labs/ssr/lib/dom-shim.js';
import * as fs from 'fs';
import { createRequire } from 'module';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import * as vm from 'vm';

export const serverContext = (options = {}) => {
  const server = options.base ? options.base : '../../server/entry-server.js';
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
  const script = new vm.Script(`${fs.readFileSync(
    resolve(base, server),
    'utf8'
  )};
        (() =>
        storefront.render
      )();`);
  vm.createContext(window);
  return script.runInContext(window);
};
