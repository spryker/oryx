import { ContentMixin } from '@spryker-oryx/experience';
import { LitElement, TemplateResult, html } from 'lit';
import { MerchantMixin } from '../src/merchant/mixins';

export class ProductSoldByComponent extends MerchantMixin(
  ContentMixin(LitElement)
) {
  protected override render(): TemplateResult | void {
    const merchant = this.$merchant();

    if (!merchant) return;

    return html`
      Sold by
      <oryx-link
        ><a href="/merchants/${merchant.id}">${merchant.name}</a
        ><oryx-link> </oryx-link
      ></oryx-link>
    `;
  }
}
