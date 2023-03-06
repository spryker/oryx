import { IdentityService } from '@spryker-oryx/auth';
import { inject, OnDestroy } from '@spryker-oryx/di';
import {
  defer,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  Subscription,
  switchMap,
} from 'rxjs';
import { User } from '../models';
import { UserAdapter } from './adapter';
import { UserService } from './user.service';

export class DefaultUserService implements UserService, OnDestroy {
  protected subscription = new Subscription();
  protected user$ = defer(() =>
    this.identity
      .get()
      .pipe(
        switchMap((identity) =>
          !identity.isAuthenticated ? of(null) : this.adapter.get()
        )
      )
  ).pipe(shareReplay({ refCount: true, bufferSize: 1 }));
  protected loading$ = defer(() =>
    merge(
      this.identity.get().pipe(map(() => true)),
      this.user$.pipe(map(() => false))
    )
  ).pipe(shareReplay({ refCount: true, bufferSize: 1 }));

  constructor(
    protected identity = inject(IdentityService),
    protected adapter = inject(UserAdapter)
  ) {
    this.initSubscriptions();
  }

  getUser(): Observable<User | null> {
    return this.user$;
  }

  getLoadingState(): Observable<boolean> {
    return this.loading$;
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected initSubscriptions(): void {
    this.subscription.add(this.user$.subscribe());
  }
}
