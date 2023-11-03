import { QueryService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { Currency, Store } from '../../models';
import { StoreService } from '../store';
import { CurrencyService } from './currency.service';
import { CurrencyChanged } from './state';

export class DefaultCurrencyService implements CurrencyService {
  private active$ = new BehaviorSubject<string | null>(null);

  constructor(
    protected storeService = inject(StoreService),
    protected queryService = inject(QueryService),
    protected localeService = inject(LocaleService, null)
  ) {}

  getAll(): Observable<Currency[]> {
    return this.loadStore().pipe(map((store) => store.currencies));
  }

  get(): Observable<string> {
    return this.active$.pipe(
      switchMap((active) =>
        active
          ? of(active)
          : this.loadStore().pipe(map((store) => store.defaultCurrency))
      )
    );
  }

  getCurrencySymbol(): Observable<string> {
    if (!this.localeService) return of('');

    //TODO: drop typecasting after typescript version is updated
    return combineLatest([
      this.get(),
      this.localeService.get() as Observable<string>,
    ]).pipe(
      map(([currency, locale]) =>
        (0)
          .toLocaleString(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
          .replace(/\d/g, '')
          .trim()
      )
    );
  }

  set(value: string): void {
    const prev = this.active$.value;
    this.active$.next(value);
    if (prev !== value)
      this.queryService.emit({ type: CurrencyChanged, data: value });
  }

  protected loadStore(): Observable<Store> {
    return this.storeService.get().pipe(filter(Boolean));
  }
}
