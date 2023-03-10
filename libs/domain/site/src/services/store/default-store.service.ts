import { inject } from '@spryker-oryx/di';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  shareReplay,
  Subscription,
  switchMap,
} from 'rxjs';
import { Store } from '../../models';
import { StoreAdapter } from '../adapter';
import { StoreService } from './store.service';

export class DefaultStoreService implements StoreService {
  protected stores$ = this.adapter.get().pipe(shareReplay(1));
  protected store$ = new BehaviorSubject<Store | null>(null);
  protected subscription = new Subscription();

  constructor(
    protected adapter = inject(StoreAdapter),
    protected store = inject('STORE')
  ) {}

  getAll(): Observable<Store[]> {
    return this.stores$;
  }

  get(): Observable<Store | null> {
    return this.store$.pipe(
      switchMap((store) =>
        !store
          ? this.getAll().pipe(
              map((stores) => {
                const store = !this.store
                  ? stores?.[0]
                  : stores.find((store) => store.id === this.store) ??
                    stores?.[0];
                this.store$.next(store);
                return this.store$.value;
              })
            )
          : of(store)
      )
    );
  }
}
