import type { PropertyValues } from '@lit/reactive-element';
import { isClient } from '@spryker-oryx/typescript-utils';
import { RenderOptions } from 'lit-html';

export interface PatchableLitElement extends HTMLElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-new
  new (...args: any[]): PatchableLitElement;
  enableUpdating(requestedUpdate?: boolean): void;
  createRenderRoot(): Element | ShadowRoot;
  renderRoot: HTMLElement | DocumentFragment;
  render(): unknown;
  renderOptions: RenderOptions;
  _$needsHydration: boolean;
  hasSSR: boolean;
}

globalThis.patchHydrateSupport = ({
  LitElement,
}: {
  LitElement: PatchableLitElement;
}) => {
  const update = LitElement.prototype.update;
  LitElement.prototype.update = function (
    this: PatchableLitElement,
    changedProperties: PropertyValues
  ) {
    if (isClient() && (this as any).hasSSR) {
      return;
    }
    update.call(this, changedProperties);
  };

  const connectedCallback = LitElement.prototype.connectedCallback;
  LitElement.prototype.connectedCallback = function (
    this: PatchableLitElement
  ) {
    if (isClient() && this.shadowRoot) {
      this.hasSSR = true;
      return;
    }
    connectedCallback.call(this);
  };
  LitElement.prototype.hydrateOnDemand = function () {
    if (this.renderRoot) {
      // Already hydrated
      return;
    }

    this.hasSSR = false;
    this.removeAttribute('defer-hydration');
    connectedCallback.call(this);
  };
};
