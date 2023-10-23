import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { RouteType } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { computed } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { MerchantMixin } from '../src/merchant/mixins';

export class ProductSoldByComponent extends MerchantMixin(
  ContentMixin(LitElement)
) {
  protected linkService = resolve(LinkService);

  // we can consider switching to content link component instead
  protected $link = computed(() =>
    this.linkService.get({ type: RouteType.Merchant, id: this.$merchant()?.id })
  );

  protected override render(): TemplateResult | void {
    const merchant = this.$merchant();

    if (!merchant) return;

    return html`
      Sold by
      <oryx-link
        ><a href=${this.$link()}>${merchant.name}</a><oryx-link> </oryx-link
      ></oryx-link>
    `;
  }
}
