import { ContentMixin } from '@spryker-oryx/experience';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { CartComponentMixin } from '../../src/mixins/cart.mixin';

export class CartTotalsComponent extends CartComponentMixin(
  ContentMixin(LitElement)
) {
  protected override render(): TemplateResult | void {
    if (!this.totals) return;
    return html` <h2>${i18n('cart.totals.summary')}</h2>
      <experience-composition .uid=${this.uid}></experience-composition>`;
  }
}
