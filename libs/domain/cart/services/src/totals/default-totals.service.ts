import {
  NormalizedTotals,
  TotalsResolver,
  TotalsResolverOptions,
  TotalsService,
} from '@spryker-oryx/cart';
import { INJECTOR, inject } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';

export class DefaultTotalsService implements TotalsService {
  constructor(protected injector = inject(INJECTOR)) {}

  protected getReference(ref: string | undefined): string {
    return `${TotalsResolver}${ref ?? 'CART'}`;
  }

  get(
    context: string,
    options?: TotalsResolverOptions
  ): Observable<NormalizedTotals | null> {
    return (
      this.injector
        .inject(this.getReference(context), null)
        ?.getTotals(options) ?? of(null)
    );
  }
}
