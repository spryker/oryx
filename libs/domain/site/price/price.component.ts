import { resolve } from '@spryker-oryx/di';
import { computed, hydratable, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { PricingService } from '../src/services';
import { PriceComponentAttributes } from './price.model';

@hydratable()
export class PriceComponent
  extends LitElement
  implements PriceComponentAttributes
{
  protected pricingService = resolve(PricingService);

  // TODO: replace with new propertySignal when it's ready
  protected priceValue = signal(undefined as undefined | number);
  @property() set value(value: number) {
    this.priceValue.set(value);
  }

  // TODO: replace with new propertySignal when it's ready
  protected currencyValue = signal(undefined as undefined | string);
  @property() set currency(value: string) {
    this.currencyValue.set(value);
  }

  // TODO: drop inner signal when observables are natively supported
  protected price = computed(() =>
    this.pricingService.format(this.priceValue(), this.currencyValue())
  );

  protected override render(): TemplateResult | void {
    return html`${this.price()}`;
  }
}
