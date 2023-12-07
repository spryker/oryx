import { MerchantMixin } from '@spryker-oryx/merchant';
import { LitElement, TemplateResult, html } from 'lit';

export class MerchantLogoComponent extends MerchantMixin(LitElement) {
  protected override render(): TemplateResult | void {
    const merchant = this.$merchant();

    if (!merchant) return;

    return html`
      <oryx-image src=${merchant.logo} alt=${merchant.name}></oryx-image>
    `;
  }
}
