import { resolve } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { combineLatest, map, Observable } from 'rxjs';
import { CurrencyService } from '../currency';
import { PriceValue, PricingService } from './pricing.service';

export class DefaultPricingService implements PricingService {
  protected currencyService = resolve(CurrencyService);
  protected localeService = resolve(LocaleService);

  format(price?: PriceValue, currency?: string): Observable<string | null> {
    if (currency) {
      return this.localeService
        .get()
        .pipe(map((locale) => this.formatPrice(price, currency, locale)));
    }

    return combineLatest([
      this.currencyService.get(),
      this.localeService.get(),
    ]).pipe(
      map(([currency, locale]) => this.formatPrice(price, currency, locale))
    );
  }

  protected formatPrice(
    price: PriceValue,
    currency: string,
    locale: string
  ): string | null {
    if (typeof price === 'undefined') return null;

    const isComplexPrice = typeof price === 'object';
    const value = isComplexPrice ? price.value : price;

    if (isComplexPrice && price.currency !== currency) return null;

    if (isNaN(+value))
      throw new Error(`Price error: ${price} is invalid value`);

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(+value / 100);
  }
}
