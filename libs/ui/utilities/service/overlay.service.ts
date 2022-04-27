import { LitElement } from 'lit';

export type OverlayServiceParentElement =
  | Element
  | ShadowRoot
  | Document
  | LitElement;
export type UIServiceParentElementRef = OverlayServiceParentElement | string;

export interface OverlayServiceOptions {
  selector?: string;
  parent?: UIServiceParentElementRef;
}

export abstract class OverlayService<T> {
  protected getParent(
    parentRef?: UIServiceParentElementRef
  ): OverlayServiceParentElement {
    const parent =
      typeof parentRef === 'string'
        ? document.querySelector(parentRef)
        : parentRef;
    return parent
      ? parent instanceof LitElement && parent.shadowRoot
        ? parent.shadowRoot
        : parent
      : document;
  }

  abstract get(options: OverlayServiceOptions): T;
}
