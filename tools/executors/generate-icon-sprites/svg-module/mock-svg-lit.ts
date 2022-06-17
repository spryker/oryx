globalThis.window = {} as any;
globalThis.document = {
  createTreeWalker: (() => {}) as any,
};
globalThis.HTMLElement = class {} as any;

export const TemplateResult = '';

export const svg = (svg: TemplateStringsArray): TemplateStringsArray => svg;
