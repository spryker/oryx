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
export const svg = (svg: string[], ...values: unknown[]): string[] => {
  const template = [];

  for (let i = 0; i < values.length; i++) {
    if (i === 0) {
      template.push(svg[i]);
    }

    template.push.apply(template, values[i]);
    template.push(svg[i + 1]);
  }

  return template.length ? template : svg;
};
