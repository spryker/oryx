import { inject } from '@spryker-oryx/di';
import { BehaviorSubject, filter, map, Observable, of, switchMap } from 'rxjs';
import { Currency, Store } from '../../models';
import { StoreService } from '../store';
import { CurrencyService } from './currency.service';

export class DefaultCurrencyService implements CurrencyService {
  private active$ = new BehaviorSubject<string | null>(null);

  constructor(protected storeService = inject(StoreService)) {}

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
    this.active$.next(value);
  }

  protected loadStore(): Observable<Store> {
    return this.storeService
      .get()
      .pipe(
        filter(<Store>(response: Store | null): response is Store => !!response)
      );
  }
}
