import { inject } from '@spryker-oryx/di';
import { map, Observable, shareReplay } from 'rxjs';
import { Store } from '../../models';
import { StoreAdapter } from '../adapter';
import { StoreService } from './store.service';

export class DefaultStoreService implements StoreService {
  protected stores$ = this.adapter.get().pipe(shareReplay(1));
  protected store$ = this.stores$.pipe(
    map(
      (stores) =>
        (this.store && stores.find((store) => store.id === this.store)) ??
        stores?.[0]
    ),
    shareReplay(1)
  );

  constructor(
    protected adapter = inject(StoreAdapter),
    protected store = inject('STORE')
  ) {}

  getAll(): Observable<Store[]> {
    return this.stores$;
  }

  get(): Observable<Store | undefined> {
    return this.store$;
  }
}
