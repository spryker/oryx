// TODO: remove local shim and use from lit-ssr when lit 3 has been released
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  CustomElementRegistry,
  Element,
  HTMLElement,
} from '@lit-labs/ssr-dom-shim';

export const getWindow: ({
  includeJSBuiltIns,
  props,
}: {
  includeJSBuiltIns?: boolean | undefined;
  props?: Record<string, any> | undefined;
}) => {
  [key: string]: unknown;
} = ({ includeJSBuiltIns = false, props = {} }) => {
  class ShadowRoot {}
  class Document {
    get adoptedStyleSheets() {
      return [];
    }
    createTreeWalker() {
      return {};
    }
    createTextNode() {
      return {};
    }
    createElement() {
      return {};
    }
  }
  class CSSStyleSheet {
    replace() {}
  }
  const window = {
    Element,
    HTMLElement,
    Document,
    document: new Document(),
    CSSStyleSheet,
    ShadowRoot,
    CustomElementRegistry,
    customElements: new CustomElementRegistry(),
    btoa(s: any) {
      return Buffer.from(s, 'binary').toString('base64');
    },
    location: new URL('http://localhost'),
    MutationObserver: class {
      observe() {}
    },
    // No-op any async tasks
    requestAnimationFrame() {},
    // Set below
    window: undefined,
    // User-provided globals, like `require`
    ...props,
  };
  if (includeJSBuiltIns) {
    Object.assign(window, {
      // No-op any async tasks
      setTimeout() {},
      clearTimeout() {},
      Buffer,
      URL,
      URLSearchParams,
      console: {
        log(...args: any[]) {
          console.log(...args);
        },
        info(...args: any[]) {
          console.info(...args);
        },
        warn(...args: any[]) {
          console.warn(...args);
        },
        debug(...args: any[]) {
          console.debug(...args);
        },
        error(...args: any[]) {
          console.error(...args);
        },
        assert(bool: boolean, msg: string) {
          if (!bool) throw new Error(msg);
        },
      },
    });
  }
  return window;
};

export const installWindowOnGlobal: (props?: {
  [key: string]: unknown;
}) => void = (props = {}) => {
  // Avoid installing the DOM shim if one already exists
  if (globalThis.window === undefined) {
    const window = getWindow({ props });
    // Copy initial window globals to node global
    Object.assign(globalThis, window);
  }
};
