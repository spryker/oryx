import { ContentMixin, LayoutMixin } from '@spryker-oryx/experience';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { LayoutAttributes } from './layout.model';

@hydrate()
export class LayoutComponent extends LayoutMixin(
  ContentMixin<LayoutAttributes>(LitElement)
) {
  protected override render(): TemplateResult {
    console.log('render');
    return html`${unsafeHTML(`<style>${this.layoutStyles()}</style>`)}<slot
      ></slot>`;
  }
}
