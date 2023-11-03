import * as buffer from 'buffer';
import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Script, createContext } from 'vm';
import { getWindow, installWindowOnGlobal } from './dom-shim';

installWindowOnGlobal();

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
      exports: {},
      Request,
      Headers,
    },
  });

  if (!window.fetch) window.fetch = fetch;

  window.setTimeout = setTimeout;
  window.clearTimeout = clearTimeout;
  window.setInterval = setInterval;
  window.clearInterval = clearInterval;
  // added because of oauth, we probably should not require oauth in the ssr
  window.TextEncoder = class {};
  window.TextDecoder = class {};
  // TODO: We need this to build ssr render script with enabled `emitDecoratorMetadata` in tsconfig
  // We can check and remove it after release with disabled `emitDecoratorMetadata`
  window.HTMLFormElement = class {};
  window.HTMLInputElement = class {};

  const script = new Script(`
    ${readFileSync(resolve(basePath, entry), 'utf8')};
    (() => ${namespace}.render)();
  `);

  createContext(window);

  return script.runInContext(window);
};
