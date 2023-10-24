import { LitElement, TemplateResult, html } from 'lit';
import { MerchantMixin } from '../../src/merchant/mixins';

export class MerchantLogoComponent extends MerchantMixin(LitElement) {
  protected override render(): TemplateResult | void {
    const merchant = this.$merchant();

    if (!merchant) return;

    return html`
      <oryx-image src=${merchant.logo} alt=${merchant.name}></oryx-image>
    `;
  }
}
