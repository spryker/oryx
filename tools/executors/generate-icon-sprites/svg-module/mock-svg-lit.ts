globalThis.window = {};
globalThis.document = {
  createTreeWalker: () => {},
};
globalThis.HTMLElement = class {};

export const TemplateResult = '';

export const svg = (svg: TemplateStringsArray): TemplateStringsArray => svg;
