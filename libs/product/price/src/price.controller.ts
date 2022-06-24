import { resolve } from '@spryker-oryx/injector';
import {
  CurrencyService,
  LocaleService,
  ProductController,
} from '@spryker-oryx/product';
import { LitElement, ReactiveController } from 'lit';
import { combineLatest, map, Observable } from 'rxjs';
import { FormattedProductPrice } from './price.model';

export class ProductPriceController implements ReactiveController {
  protected productController: ProductController;

  protected currencyService = resolve(CurrencyService);
  protected localeService = resolve(LocaleService);

  /**
   * Formats the product prices by the help of the current locale.
   */
  price$: Observable<FormattedProductPrice>;

  hostConnected?(): void;

  constructor(protected host: LitElement) {
    host.addController(this);

    this.productController = new ProductController(host, [
      'abstract-product-prices',
    ]);

    this.price$ = this.getPrices();
  }

  protected getPrices(): Observable<FormattedProductPrice> {
    return combineLatest([
      this.productController.getProduct(),
      this.currencyService.get(),
      this.localeService.get(),
    ]).pipe(
      map(([product, currency, locale]) => {
        const formattedPrice: FormattedProductPrice = {};
        if (
          product?.price?.defaultPrice?.value &&
          product.price.defaultPrice.currency === currency
        ) {
          formattedPrice.defaultPrice = {
            ...product.price.defaultPrice,
            formattedPrice: this.format(
              product.price.defaultPrice.value,
              currency,
              locale
            ),
          };
        }
        if (
          product?.price?.originalPrice?.value &&
          product.price.originalPrice.currency === currency
        ) {
          formattedPrice.originalPrice = {
            ...product.price.originalPrice,
            formattedPrice: this.format(
              product.price.originalPrice.value,
              currency,
              locale
            ),
          };
        }
        return formattedPrice;
      })
    );
  }

  protected format(price: number, currency: string, locale: string): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(price / 100);
  }
}
