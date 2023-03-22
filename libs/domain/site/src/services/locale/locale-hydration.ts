import { HydrateInitializer, HydrateService } from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/di';
import { Observable, skip, take, tap } from 'rxjs';
import { LocaleService } from './locale.service';

export const localeHydration = {
  provide: HydrateInitializer,
  useValue: (
    service: HydrateService,
    injector: Injector
  ): Observable<unknown> =>
    injector
      .inject(LocaleService)
      .get()
      .pipe(
        skip(1),
        take(1),
        tap(() => service.initHydrateHooks(true))
      ),
};
