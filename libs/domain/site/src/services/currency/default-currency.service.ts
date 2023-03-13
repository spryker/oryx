import { QueryService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { BehaviorSubject, filter, map, Observable, of, switchMap } from 'rxjs';
import { Currency, Store } from '../../models';
import { StoreService } from '../store';
import { CurrencyService } from './currency.service';
import { CurrencyChanged } from './state';

export class DefaultCurrencyService implements CurrencyService {
  private active$ = new BehaviorSubject<string | null>(null);

  constructor(
    protected storeService = inject(StoreService),
    protected queryService = inject(QueryService)
  ) {
    // TODO: Make currency service available globally for testing
    (globalThis as any).oryxCurrency = this;
  }

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

  set(value: string): void {
    const prev = this.active$.value;
    this.active$.next(value);
    if (prev !== value) {
      this.queryService.emit({ type: CurrencyChanged, data: value });
    }
  }

  protected loadStore(): Observable<Store> {
    return this.storeService.get().pipe(filter(Boolean));
  }
}
