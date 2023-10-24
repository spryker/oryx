import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { RouteType } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { computed } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { MerchantMixin } from '../src/merchant/mixins';
import { merchantSoldByStyles } from './sold-by.styles';

export class ProductSoldByComponent extends MerchantMixin(
  ContentMixin(LitElement)
) {
  static styles = merchantSoldByStyles;

  protected linkService = resolve(LinkService);

  // we can consider switching to content link component instead
  protected $link = computed(() =>
    this.linkService.get({
      type: RouteType.Merchant,
      id: this.$merchantMinimal()?.id,
    })
  );

  protected override render(): TemplateResult | void {
    const merchant = this.$merchantMinimal();

    if (!merchant) return;

    return html`
      <span part="prefix">${this.i18n('merchant.sold-by')}</span>
      <oryx-link
        ><a href=${this.$link()}>${merchant.name}</a><oryx-link> </oryx-link
      ></oryx-link>
    `;
  }
}
