import { inject, INJECTOR } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';
import { NormalizedTotals } from '../../models';
import { TotalsResolver, TotalsService } from './totals.service';

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
