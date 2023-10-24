import { ContentMixin } from '@spryker-oryx/experience';
import { LitElement, TemplateResult, html } from 'lit';
import { MerchantMixin } from '../../src/merchant/mixins';
import { merchantContactStyles } from './contact.styles';

export class MerchantContactComponent extends MerchantMixin(
  ContentMixin(LitElement)
) {
  static styles = merchantContactStyles;

  protected override render(): TemplateResult | void {
    const merchant = this.$merchant();

    if (!merchant) return;

    return html`
      <h3>${this.i18n('contact')}</h3>

      <oryx-link icon="alternate_email">
        <a href="mailto:${merchant.contact?.email}">
          ${merchant.contact?.email}
        </a>
      </oryx-link>

      <oryx-link icon="phone">
        <a href="tel:${merchant.contact?.phone}">
          ${merchant.contact?.phone}
        </a>
      </oryx-link>
    `;
  }
}
