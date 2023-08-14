import { ContextFallback } from '@spryker-oryx/core';
import { inject, Provider } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { map } from 'rxjs';

export const enum AccountContext {
  TAB = 'tab',
}

export const AccountContextFallback: Provider = {
  provide: `${ContextFallback}${AccountContext.TAB}`,
  useFactory: () =>
    inject(RouterService)
      .currentParams()
      .pipe(map((params) => params?.tab)),
};
