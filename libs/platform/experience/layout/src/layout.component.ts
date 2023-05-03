import { ContentMixin, LayoutMixin } from '@spryker-oryx/experience';
import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { LayoutAttributes } from './layout.model';
import { styles } from './layout.styles';

@hydratable()
export class LayoutComponent extends LayoutMixin(
  ContentMixin<LayoutAttributes>(LitElement)
) {
  static styles = [styles];

  protected override render(): TemplateResult {
    return html`${unsafeHTML(`<style>${this.layoutStyles()}</style>`)}<slot
      ></slot>`;
  }
}
