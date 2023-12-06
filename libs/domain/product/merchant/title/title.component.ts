import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouteType } from '@spryker-oryx/router';
import { LitElement, TemplateResult, html } from 'lit';
import { MerchantMixin } from '../../src/merchant/mixins';
import { MerchantLinkOptions } from './title.model';

@defaultOptions({ link: true })
export class MerchantTitleComponent extends MerchantMixin(
  ContentMixin<MerchantLinkOptions>(LitElement)
) {
  protected override render(): TemplateResult | void {
    const merchant = this.$merchantMinimal();

    if (!merchant) return;

    return html`${this.renderPrefix()}${this.renderTitle()}`;
  }

  protected renderTitle(): TemplateResult | void {
    const merchant = this.$merchantMinimal();

    if (!merchant) return;

    const { link } = this.$options();
    if (link) {
      return this.renderLink();
    } else {
      return html`${merchant.name}`;
    }
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
    return html`<span part="prefix">${prefix} </span>`;
  }
}
