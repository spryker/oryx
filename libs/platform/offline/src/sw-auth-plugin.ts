import { OauthService } from '@spryker-oryx/auth';
import { ExecPlugin, InjectionPlugin } from '@spryker-oryx/core';

export class SwAuthPlugin extends ExecPlugin {
  constructor() {
    super((app) => {
      const injector = app!.requirePlugin(InjectionPlugin).getInjector();

      injector.inject(OauthService).invokeStoredToken();
    });
  }
}
