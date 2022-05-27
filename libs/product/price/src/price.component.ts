import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, observe } from '@spryker-oryx/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import {
  CurrencyService,
  LocaleService,
  ProductContext,
  ProductService,
} from '../../src';
import { Prices } from './price.model';
import { styles } from './price.styles';

export class PriceComponent extends LitElement {
  static styles = styles;
  @property({ type: String }) uid?: string;

  @property({ type: String }) code?: string;

  @observe()
  protected code$ = new BehaviorSubject(this.code);

  protected productService = resolve(this, ProductService);
  protected context = new ContextController(this);
  protected currencyService = resolve(this, CurrencyService);
  protected localeService = resolve(this, LocaleService);

  protected currency$ = this.currencyService.get();
  protected locale$ = this.localeService.get();

  protected productPrices$ = this.context
    .get(ProductContext.Code, this.code$)
    .pipe(
      switchMap((code) =>
        this.productService.get({
          sku: code,
          include: ['abstract-product-prices'],
        })
      ),
      map((product) => product?.prices ?? [])
    );

  protected prices$ = combineLatest([
    this.productPrices$,
    this.currency$,
    this.locale$,
  ]).pipe(
    map(([prices, currency, locale]) =>
      prices?.reduce(
        (
          acc,
          { priceTypeName, netAmount, grossAmount, currency: responseCurrency }
        ) => {
          if (responseCurrency.code !== currency) return {} as Prices;

          return {
            grossAmount: {
              ...acc.grossAmount,
              [priceTypeName.toLowerCase()]: this.formatPrice(
                grossAmount,
                currency,
                locale
              ),
            },
            netAmount: {
              ...acc.netAmount,
              [priceTypeName.toLowerCase()]: this.formatPrice(
                netAmount,
                currency,
                locale
              ),
            },
          };
        },
        {} as Prices
      )
    )
  );

  private formatPrice(
    price: number | null,
    currency: string,
    locale: string
  ): string | null {
    if (typeof price !== 'number') {
      return null;
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(price / 100);
  }

  override render(): TemplateResult {
    return html`${asyncValue(this.prices$, (prices: Prices) => {
      if (!prices.grossAmount || !prices.netAmount) {
        return html``;
      }

      return html`${Object.entries(prices).map(([key, val]) => {
        if (!val.default) {
          return html``;
        }

        return html`
          <div class="price ${key}">
            <div class="default">${val.default}</div>
            ${val.original
              ? html`<div class="original">${val.original}</div>`
              : ''}
          </div>
        `;
      })}`;
    })}`;
  }
}
