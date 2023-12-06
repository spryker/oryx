import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouteType } from '@spryker-oryx/router';
import { LitElement, TemplateResult, html } from 'lit';
import { MerchantMixin } from '../src/merchant/mixins';
import { MerchantLinkOptions } from './sold-by.model';

@defaultOptions({ prefix: 'Sold by: ' })
export class MerchantSoldByComponent extends MerchantMixin(
  ContentMixin<MerchantLinkOptions>(LitElement)
) {
  protected override render(): TemplateResult | void {
    const merchant = this.$merchantMinimal();

    if (!merchant) return;

    return html`${this.renderPrefix()}${this.renderLink()}`;
  }

  protected renderLink(): TemplateResult | void {
    const merchant = this.$merchantMinimal();

    if (!merchant) return;

    const options = {
      type: RouteType.Merchant,
      id: merchant?.id,
    };

    return html`<oryx-content-link .options=${options}>
      ${merchant.name}
    </oryx-content-link>`;
  }

  protected renderPrefix(): TemplateResult | void {
    const { prefix } = this.$options();
    if (!prefix) return;
    return html`<span part="prefix">${prefix}</span>`;
  }
}
