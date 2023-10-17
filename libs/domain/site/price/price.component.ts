import { resolve } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import {
  computed,
  hydrate,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { SitePriceComponentAttributes } from './price.model';
import { priceStyles } from './price.styles';

@hydrate()
@signalAware()
export class SitePriceComponent
  extends LitElement
  implements SitePriceComponentAttributes
{
  static styles = priceStyles;

  protected pricingService = resolve(PricingService);

  @signalProperty() value?: number;
  @signalProperty() currency?: string;
  @property({ type: Boolean, reflect: true }) discounted?: boolean;
  @property({ type: Boolean, reflect: true }) original?: boolean;

  protected $price = computed(() =>
    this.pricingService.format(this.value, this.currency)
  );

  protected override render(): TemplateResult | void {
    return html`${this.$price()}`;
  }
}
