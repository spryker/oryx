globalThis.window = {} as any;
globalThis.document = {
  createTreeWalker: () => {},
} as any;
globalThis.HTMLElement = class {} as any;
globalThis.customElements = {
  get: () => {},
  define: () => {},
} as any;

export class LitElement {}
export class AsyncDirective {}
export class Directive {}
export function directive() {}
export const TemplateResult = '';
export const html = () => '';
export const css = () => '';
export const property = () => '';
export const when = () => '';
export const svg = (svg: string[], ...values: string[][]): string[] => {
  const template = [svg[0]];

  for (let i = 0; i < values.length; i++) {
    template.push(...values[i]);
    template.push(svg[i + 1]);
  }

  return template;
};
