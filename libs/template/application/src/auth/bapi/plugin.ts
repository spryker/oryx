import { OauthService, OauthServiceConfig } from '@spryker-oryx/auth';
import { App, AppPlugin } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { combineLatest, Subscription, tap } from 'rxjs';

export class BapiPlugin implements AppPlugin {
  protected subscription?: Subscription;

  getName(): string {
    return 'oryx$bapi';
  }

  apply(app: App): void | Promise<void> {
    this.subscription = combineLatest([
      resolve(OauthService).isAuthenticated(),
      resolve(RouterService).route(),
    ])
      .pipe(
        tap(([authenticated, currentRoute]) => {
          const oauthConfig = resolve(OauthServiceConfig);
          const redirectUrl = new URL(
            oauthConfig.providers[0].redirectUrl as string
          );
          if (
            !authenticated &&
            currentRoute !== oauthConfig.loginRoute &&
            !currentRoute.startsWith(redirectUrl.pathname)
          ) {
            resolve(OauthService).login();
          }
          if (
            authenticated &&
            (currentRoute.startsWith(oauthConfig.loginRoute) ||
              currentRoute.startsWith(redirectUrl.pathname))
          ) {
            resolve(RouterService).navigate('/');
          }
        })
      )
      .subscribe();
  }

  destroy(app?: App): void {
    this.subscription?.unsubscribe();
  }
}
