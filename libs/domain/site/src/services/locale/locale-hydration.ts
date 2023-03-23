import { HydrationTrigger } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { Observable, skip, take } from 'rxjs';

export const localeHydration = {
  provide: HydrationTrigger,
  useFactory: (): Observable<unknown> =>
    inject(LocaleService).get().pipe(skip(1), take(1)),
};
