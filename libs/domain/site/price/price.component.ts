import { resolve } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import {
  computed,
  hydrate,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { SitePriceComponentAttributes } from './price.model';

@hydrate()
@signalAware()
export class SitePriceComponent
  extends LitElement
  implements SitePriceComponentAttributes
{
  protected pricingService = resolve(PricingService);

  @signalProperty() value?: number;
  @signalProperty() currency?: string;

  protected $price = computed(() =>
    this.pricingService.format(this.value, this.currency)
  );

  protected override render(): TemplateResult | void {
    return html`${this.$price()}`;
  }
}
