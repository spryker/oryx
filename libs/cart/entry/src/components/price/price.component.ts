import { resolve } from '@spryker-oryx/injector';
import { PricingService } from '@spryker-oryx/site';
import {
  asyncValue,
  observe,
  subscribe,
} from '@spryker-oryx/utilities/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { BehaviorSubject, switchMap } from 'rxjs';
import { CartEntryPrice } from '../../entry.model';
import { cartEntryPriceStyles } from './price.styles';

export class CartEntryPriceComponent
  extends LitElement
  implements CartEntryPrice
{
  static styles = cartEntryPriceStyles;

  @property() price?: number;

  @property({ type: Boolean, reflect: true }) loading = false;

  protected pricingService = resolve(PricingService);

  @observe()
  protected price$ = new BehaviorSubject(this.price);

  @subscribe()
  protected formattedPrice$ = this.price$.pipe(
    switchMap((price) => this.pricingService.format(price))
  );

  protected render(): TemplateResult {
    return html`
      <slot></slot>
      ${asyncValue(
        this.formattedPrice$,
        (value) => html`<span part="price">${value}</span>`
      )}
    `;
  }
}
