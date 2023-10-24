import { ContentMixin } from '@spryker-oryx/experience';
import { LitElement, TemplateResult, html } from 'lit';
import { MerchantMixin } from '../../src/merchant/mixins';

export class MerchantTitleComponent extends MerchantMixin(
  ContentMixin(LitElement)
) {
  protected override render(): TemplateResult | void {
    const merchant = this.$merchant();

    if (!merchant) return;

    return html` <h1>${merchant.name}</h1> `;
  }
}
