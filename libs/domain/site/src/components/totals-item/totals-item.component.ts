import { TokenResolver } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { TotalsConfig } from '@spryker-oryx/site';
import { computed, hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { filter, map, of } from 'rxjs';
import { SiteTotalsItemOptions } from './totals-item.model';

@hydratable('window:load')
export class SiteTotalsItemComponent extends ContentMixin<SiteTotalsItemOptions>(
  LitElement
) {
  protected tokenResolver = resolve(TokenResolver);
  protected $config = computed(() => {
    const { type, discountRowsAppearance, enableTaxMessage } = this.$options();

    if (!type) return of(null);

    return this.tokenResolver.resolveData<TotalsConfig>(type).pipe(
      filter((totals) => !!totals),
      map((totals) => ({
        ...totals,
        ...(discountRowsAppearance
          ? { pricesBehavior: discountRowsAppearance }
          : {}),
        ...(!enableTaxMessage ? { subtext: undefined } : {}),
      }))
    );
  });

  protected override render(): TemplateResult | void {
    const config = this.$config();
    if (!config) return;

    const {
      label,
      subtext,
      value,
      currency,
      prices,
      pricesBehavior,
      accented,
      delimiter,
    } = config;

    return html`<oryx-site-summary-price
      .label=${label}
      .subtext=${subtext}
      .value=${value}
      .currency=${currency}
      .prices=${prices}
      .pricesBehavior=${pricesBehavior}
      ?delimiter=${delimiter}
      ?accented=${accented}
    ></oryx-site-summary-price>`;
  }
}
