import {
  HttpHandlerFn,
  HttpInterceptor,
  RequestOptions,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, switchMap, take } from 'rxjs';
import { AuthHeaderTypes, Identity } from '../../models';
import { IdentityService } from './identity.service';

export class DefaultIdentityInterceptor implements HttpInterceptor {
  constructor(protected identity = inject(IdentityService)) {}

  intercept(
    url: string,
    options: RequestOptions,
    handle: HttpHandlerFn
  ): Observable<Response> {
    return this.identity.get().pipe(
      take(1),
      switchMap((identity) =>
        handle(url, this.optionsWithHeaders(identity, options))
      )
    );
  }

  protected optionsWithHeaders(
    identity: Identity,
    options: RequestOptions
  ): RequestOptions {
    if (!identity.anonymous && identity.token) {
      delete options.headers?.[
        AuthHeaderTypes.AnonymousCustomerUniqueId as unknown as keyof typeof options.headers
      ];

      options.headers = {
        ...options.headers,
        [AuthHeaderTypes.Authorization]: `${identity.token.tokenType} ${identity.token.accessToken}`,
      };
    } else {
      delete options.headers?.[
        AuthHeaderTypes.Authorization as unknown as keyof typeof options.headers
      ];

      options.headers = {
        ...options.headers,
        [AuthHeaderTypes.AnonymousCustomerUniqueId]: identity.id,
      };
    }

    return options;
  }
}
