import { HydrateInitializer, HydrateService } from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/di';
import { rootInjectable } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { Observable, skip, take, tap } from 'rxjs';
import { RouterService } from './router.service';

export const routerHydration = {
  provide: HydrateInitializer,
  useValue: (
    service: HydrateService,
    injector: Injector
  ): Observable<unknown> =>
    injector
      .inject(RouterService)
      .currentRoute()
      .pipe(
        skip(1),
        take(1),
        tap(() => {
          const root = rootInjectable.get();
          const queryRoot = document.querySelector(root);
          const querySelector =
            root === 'body' ? queryRoot : queryRoot?.shadowRoot;
          const component = querySelector?.querySelector(
            '[route]'
          ) as LitElement;
          service.hydrateOnDemand(component, true);
        })
      ),
};
