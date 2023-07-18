import { resolve } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import {
  computed,
  hydrate,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { PriceComponentAttributes } from './price.model';

@hydrate()
@signalAware()
export class PriceComponent
  extends LitElement
  implements PriceComponentAttributes
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
