import {
  getWindow,
  installWindowOnGlobal,
} from '@lit-labs/ssr/lib/dom-shim.js';
import * as buffer from 'buffer';
import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createContext, Script } from 'vm';

installWindowOnGlobal();
// added because of oauth, we probably should not require oauth in the ssr
console.log('TextEncoder', TextEncoder);

interface ContextOptions {
  entry: string;
  namespace?: string;
  root?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serverContext = (options: ContextOptions): any => {
  const { entry, root = import.meta.url, namespace = 'storefront' } = options;
  const basePath = dirname(fileURLToPath(root));
  const window = getWindow({
    includeJSBuiltIns: true,
    props: {
      require: createRequire(root),
      Event,
      process,
      buffer,
      // added because of oauth, we probably should not require oauth in the ssr
      TextEncoder,
      TextDecoder,
      exports: {},
    },
  });
  window.setTimeout = setTimeout;

  const script = new Script(`
    ${readFileSync(resolve(basePath, entry), 'utf8')};
    (() => ${namespace}.render)();
  `);

  createContext(window);

  return script.runInContext(window);
};
