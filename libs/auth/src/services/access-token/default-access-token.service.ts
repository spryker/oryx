import { StorageService, StorageType } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import {
  BehaviorSubject,
  concat,
  filter,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { AccessToken } from '../../models';
import { canRenew, requiresRefresh } from '../../utils';
import { AuthAdapter } from '../auth';
import { AccessTokenService } from './access-token.service';

export class DefaultAccessTokenService implements AccessTokenService {
  protected token$ = new BehaviorSubject<AccessToken | null>(null);
  protected STORAGE_KEY = 'access-token';
  protected persistent = false;

  protected isLoading$ = new BehaviorSubject(true);

  constructor(
    protected adapter = inject(AuthAdapter),
    protected storage = inject(StorageService)
  ) {
    this.initializeFromStorage();
  }

  protected initializeFromStorage(): void {
    const tokenFrom = (storage: StorageType): Observable<AccessToken> =>
      this.storage
        .get<AccessToken>(this.STORAGE_KEY, storage)
        .pipe(filter(Boolean));

    concat(
      tokenFrom(StorageType.SESSION),
      tokenFrom(StorageType.LOCAL).pipe(tap(() => (this.persistent = true)))
    )
      .pipe(take(1))
      .subscribe({
        next: (token) => {
          this.token$.next(token);
        },
        complete: () => {
          this.isLoading$.next(false);
        },
      });
  }

  get(): Observable<AccessToken | null> {
    return this.isLoading$.pipe(
      filter((loading) => !loading),
      switchMap(() => this.token$),
      filter((token) => this.renewIfNeeded(token))
    );
  }

  protected renewIfNeeded(token: AccessToken | null): boolean {
    if (token && requiresRefresh(token)) {
      if (canRenew(token)) this.renew(token);
      else {
        this.remove();
      }
      return false;
    }
    return true;
  }

  protected renew(token: AccessToken): void {
    this.isLoading$.next(true);

    this.adapter.refresh(token).subscribe({
      next: (token) => {
        this.isLoading$.next(false);
        this.set({ token });
      },
      error: () => this.remove(),
      complete: () => this.isLoading$.next(false),
    });
  }

  remove(): Observable<unknown> {
    this.token$.next(null);
    return this.storage.remove(this.STORAGE_KEY, this.getStorageType());
  }

  set({
    token,
    persist,
  }: {
    token: AccessToken;
    persist?: boolean;
  }): Observable<unknown> {
    this.token$.next(token);
    if (persist !== undefined) this.persistent = persist;
    return this.storage.set(this.STORAGE_KEY, token, this.getStorageType());
  }

  protected getStorageType(): StorageType {
    return this.persistent ? StorageType.LOCAL : StorageType.SESSION;
  }
}
