import { provideEffect } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';

import { CurrencyChanged } from '@spryker-oryx/site';
import { tap } from 'rxjs';

export const productListEffects = [
  provideEffect([
    CurrencyChanged,
    ({ query }) => {
      resolve(RouterService)
      .getUrl('', {
        queryParams: {
          'price[min]': '',
          'price[max]': '',
        },
        queryParamsHandling: 'merge',
        ignoreQueryParams: ['page'],
      })
      .pipe(tap((url) => resolve(RouterService).navigate(url)))
      .subscribe();
    },
  ]),
];
