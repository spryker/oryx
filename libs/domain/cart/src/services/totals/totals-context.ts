import { ContextServiceFallback } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { TotalsContext } from './totals.service';
import { of } from 'rxjs';

export const TotalsContextFallback: Provider = {
  provide: `${ContextServiceFallback}${TotalsContext.Reference}`,
  useValue: of('CART')
};
