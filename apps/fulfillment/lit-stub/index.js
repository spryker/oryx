/* eslint-disable @typescript-eslint/no-empty-function */
export function html(strings) {
  return strings.join('');
}

export function css(strings) {
  return strings.join('');
}

export function svg(strings) {
  return strings.join('');
}

export function unsafeCSS(css) {
  return css;
}

export class ReactiveElement {
  static addInitializer() {}
}

export class LitElement extends ReactiveElement {}

export function isServer() {
  return false;
}

export function render() {}

export const noChange = Symbol('noChange-stub');

export const CSSResult = null;

export const nothing = Symbol('nothing');
