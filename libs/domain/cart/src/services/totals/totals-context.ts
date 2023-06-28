import { ContextServiceFallback } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { TotalsContext } from './totals.service';

export const TotalsContextFallback: Provider = {
  provide: `${ContextServiceFallback}${TotalsContext.Reference}`,
  useValue: of('CART'),
};
