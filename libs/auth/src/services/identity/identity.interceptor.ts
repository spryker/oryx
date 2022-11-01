import {
  HttpHandlerFn,
  HttpInterceptor,
  RequestOptions,
} from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { Observable, switchMap } from 'rxjs';
import { AuthHeaderTypes, Identity } from '../../models';
import { IdentityService } from './identity.service';

export function identityInterceptor(): HttpInterceptor {
  const identity = resolve(IdentityService);

  const optionsWithHeaders = (
    identity: Identity,
    options: RequestOptions
  ): RequestOptions => {
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
  };

  return {
    intercept: (
      url: string,
      options: RequestOptions,
      handle: HttpHandlerFn
    ): Observable<Response> => {
      return identity
        .get()
        .pipe(
          switchMap((identity) =>
            handle(url, optionsWithHeaders(identity, options))
          )
        );
    },
  };
}
