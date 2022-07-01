globalThis.window = {};
globalThis.document = {
  createTreeWalker: () => {},
};
globalThis.HTMLElement = class {};
globalThis.customElements = {
  get: () => {},
  define: () => {},
};

export class LitElement {}

export const TemplateResult = '';
export const html = () => '';
export const css = () => '';
export const property = () => '';
export const when = () => '';
export const svg = (svg) => svg;
