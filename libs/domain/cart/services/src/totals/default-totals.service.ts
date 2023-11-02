import {
  NormalizedTotals,
  TotalsResolver,
  TotalsService,
} from '@spryker-oryx/cart';
import { INJECTOR, inject } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';

export class DefaultTotalsService implements TotalsService {
  constructor(protected injector = inject(INJECTOR)) {}

  protected getReference(ref: string | undefined): string {
    return `${TotalsResolver}${ref ?? 'CART'}`;
  }

  get(context: string): Observable<NormalizedTotals | null> {
    return (
      (
        this.injector.inject(
          this.getReference(context),
          null
        ) as TotalsResolver | null
      )?.getTotals() ?? of(null)
    );
  }
}
