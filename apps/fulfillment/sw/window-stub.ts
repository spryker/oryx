/* eslint-disable @typescript-eslint/no-explicit-any */

const recursiveProxy: any = new Proxy(() => void 0, {
  get: () => recursiveProxy,
  apply: () => recursiveProxy,
});

globalThis.window = recursiveProxy;
globalThis.document = recursiveProxy;
globalThis.customElements = recursiveProxy;
globalThis.Document = recursiveProxy;
globalThis.HTMLElement = class {} as any;
globalThis.CSSStyleSheet = class {} as any;

export {};
