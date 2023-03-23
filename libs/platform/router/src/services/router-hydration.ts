import { HydrateInitializer } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { rootInjectable } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { map, Observable, skip, take } from 'rxjs';
import { RouterService } from './router.service';

export const routerHydration = {
  provide: HydrateInitializer,
  useFactory: (): Observable<HTMLElement> =>
    inject(RouterService)
      .currentRoute()
      .pipe(
        skip(1),
        take(1),
        map(() => {
          const root = rootInjectable.get();
          const queryRoot = document.querySelector(root);
          const querySelector =
            root === 'body' ? queryRoot : queryRoot?.shadowRoot;

          return querySelector?.querySelector('[route]') as LitElement;
        })
      ),
};
