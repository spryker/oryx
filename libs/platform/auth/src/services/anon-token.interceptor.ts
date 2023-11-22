import { HttpHandlerFn, HttpInterceptor } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, catchError, map, of, switchMap, take } from 'rxjs';
import { AuthIdentity } from '../models';
import { IdentityService } from './identity.service';

/**
 * rename?
 */
export class AnonTokenInterceptor implements HttpInterceptor {
  protected headerName = this.config.headerName;

  constructor(
    protected readonly config = inject(AnonTokenInterceptorConfig),
    protected readonly identityService = inject(IdentityService)
  ) {}

  intercept(req: Request, handle: HttpHandlerFn): Observable<Response> {
    return this.identityService.get().pipe(
      take(1),
      map((token) => this.addAnonHeader(token, req)),
      catchError(() => of(req)),
      switchMap((newReq) => handle(newReq))
    );
  }

  shouldInterceptRequest({ url }: Request): boolean {
    return !this.config.baseUrl || url.startsWith(this.config.baseUrl);
  }

  protected addAnonHeader(token: AuthIdentity, req: Request): Request {
    if (token.isAuthenticated || !token.userId) {
      return req;
    }

    const newReq = req.clone();
    newReq.headers.set(this.headerName, token.userId);

    return newReq;
  }
}

export interface AnonTokenInterceptorConfig {
  headerName: string;
  baseUrl?: string;
}

export const AnonTokenInterceptorConfig = 'oryx.AnonTokenInterceptorConfig';

declare global {
  interface InjectionTokensContractMap {
    [AnonTokenInterceptorConfig]: AnonTokenInterceptorConfig;
  }
}
