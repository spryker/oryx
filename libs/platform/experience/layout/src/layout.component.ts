import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ContentMixin } from '../../src/mixins';
import { styles } from '../../src/services/layout/styles/base.styles';
import { LayoutMixin } from './layout.mixin';
import { LayoutAttributes } from './layout.model';

@hydratable()
export class LayoutComponent extends LayoutMixin(
  ContentMixin<LayoutAttributes>(LitElement)
) {
  static styles = styles;

  protected override render(): TemplateResult {
    return html`${unsafeHTML(`<style>${this.layoutStyles()}</style>`)}<slot
      ></slot>`;
  }
}
