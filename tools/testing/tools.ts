import { LitElement } from 'lit';

export function getShadowElementBySelector<
  T extends LitElement,
  K extends keyof HTMLElementTagNameMap
>(
  element: T,
  selector: K | string
): HTMLElementTagNameMap[K] | null | undefined {
  return element.shadowRoot?.querySelector(selector);
}
