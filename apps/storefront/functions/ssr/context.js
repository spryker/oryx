import { getWindow } from '@lit-labs/ssr/lib/dom-shim.js';
import * as fs from 'fs';
import { createRequire } from 'module';
import * as path from 'path';
import * as vm from 'vm';

export const serverContext = (options = {}) => {
  const base = options.base ? options.base : './';
  const url = options.url ? options.url : import.meta.url;
  const window = getWindow({
    includeJSBuiltIns: true,
    props: {
      require: createRequire(url),
    },
  });
  window.URLSearchParams = URLSearchParams;
  window.URL = URL;
  window.exports = {};
  //TODO decide how we want to resolve entry-server properly
  const script = new vm.Script(`${fs.readFileSync(
    path.resolve(base, 'dist/apps/storefront/server/entry-server.js'),
    'utf8'
  )};
        (() =>
        storefront.render
      )();`);
  vm.createContext(window);
  return script.runInContext(window);
};
