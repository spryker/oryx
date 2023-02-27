import { resolve } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { take } from 'rxjs';
import { CartEntryPrice } from '../../entry.model';
import { cartEntryPriceStyles } from './price.styles';

export class CartEntryPriceComponent
  extends LitElement
  implements CartEntryPrice
{
  static styles = cartEntryPriceStyles;

  protected pricingService = resolve(PricingService);

  @state() formattedPrice?: string;

  @property() set price(value: number) {
    this.pricingService
      .format(value)
      .pipe(take(1))
      .subscribe((formatted) => {
        if (formatted) {
          this.formattedPrice = formatted;
        }
      });
  }

  protected render(): TemplateResult | void {
    if (this.formattedPrice) {
      return html`
        <slot></slot>
        <span part="price">${this.formattedPrice}</span>
      `;
    }
  }
}
