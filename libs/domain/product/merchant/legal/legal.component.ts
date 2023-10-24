import { LitElement, TemplateResult, html } from 'lit';
import { MerchantMixin } from '../../src/merchant/mixins';

export class MerchantLegalComponent extends MerchantMixin(LitElement) {
  protected override render(): TemplateResult | void {
    const merchant = this.$merchant();

    if (!merchant) return;

    return html`
      <oryx-text .content=${merchant.legal?.terms}></oryx-text>
      <oryx-text .content=${merchant.legal?.cancellationPolicy}></oryx-text>
      <oryx-text .content=${merchant.legal?.imprint}></oryx-text>
      <oryx-text .content=${merchant.legal?.dataPrivacy}></oryx-text>
    `;
  }
}
