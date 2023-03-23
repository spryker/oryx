import { HydrateInitializer } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, skip, take } from 'rxjs';
import { CurrencyService } from './currency.service';

export const currencyHydration = {
  provide: HydrateInitializer,
  useFactory: (): Observable<unknown> =>
    inject(CurrencyService).get().pipe(skip(1), take(1)),
};
