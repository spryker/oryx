import { HydrateInitializer, HydrateService } from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/di';
import { Observable, skip, take, tap } from 'rxjs';
import { CurrencyService } from './currency.service';

export const currencyHydration = {
  provide: HydrateInitializer,
  useValue: (
    service: HydrateService,
    injector: Injector
  ): Observable<unknown> =>
    injector
      .inject(CurrencyService)
      .get()
      .pipe(
        skip(1),
        take(1),
        tap(() => service.initHydrateHooks(true))
      ),
};
