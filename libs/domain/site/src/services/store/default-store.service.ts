import { inject } from '@spryker-oryx/di';
import {
  BehaviorSubject,
  combineLatest,
  defer,
  map,
  Observable,
  shareReplay,
} from 'rxjs';
import { Store } from '../../models';
import { StoreAdapter } from '../adapter';
import { StoreService } from './store.service';

export class DefaultStoreService implements StoreService {
  protected activeStore$ = new BehaviorSubject<string | undefined>(this.store);
  protected stores$ = defer(() => this.adapter.get()).pipe(shareReplay(1));
  protected store$ = combineLatest([this.stores$, this.activeStore$]).pipe(
    map(([stores, activeStore]) =>
      activeStore
        ? stores?.find((store) => store.id === activeStore)
        : stores?.[0]
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
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

  set(storeId: string): void {
    this.activeStore$.next(storeId);
  }
}
