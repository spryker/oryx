import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@spryker-oryx/injector';
import {
  catchError,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { AccessTokenService } from './access-token.service';
import { AuthAdapter, AuthenticateQualifier } from './adapter';
import { AuthService } from './auth.service';
import { AccessToken } from './model';

export class DefaultAuthService implements AuthService {
  constructor(
    protected adapter = inject(AuthAdapter),
    protected accessToken = inject(AccessTokenService)
  ) {}

  login(qualifier: AuthenticateQualifier): Observable<boolean> {
    return this.adapter.authenticate(qualifier).pipe(
      tap((token) =>
        this.accessToken.set({ token, persist: qualifier.remember })
      ),
      catchError((e: HttpErrorResponse) =>
        this.logout().pipe(
          switchMap(() => throwError(() => new Error(`${e.name} ${e.status}`)))
        )
      ),
      map((token: AccessToken | unknown) => !!token)
    );
  }

  logout(): Observable<unknown> {
    return this.accessToken
      .remove()
      .pipe(switchMap((ret) => this.adapter.revoke?.() ?? of(ret)));
  }

  isAuthenticated(): Observable<boolean> {
    return this.accessToken.get().pipe(map(Boolean), distinctUntilChanged());
  }
}
