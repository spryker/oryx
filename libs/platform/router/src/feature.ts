import { AppFeature } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  DefaultRouterService,
  routerHydration,
  RouterService,
} from './services';

export class RouterFeature implements AppFeature {
  providers: Provider[] = this.getProviders();

  protected getProviders(): Provider[] {
    return [
      { provide: RouterService, useClass: DefaultRouterService },
      routerHydration,
    ];
  }
}
