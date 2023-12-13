import {
  NormalizedTotals,
  TotalsOptions,
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

  get(
    contextOptions?: TotalsOptions | string
  ): Observable<NormalizedTotals | null> {
    const { totalsContext, ...options } =
      typeof contextOptions === 'object'
        ? contextOptions
        : { totalsContext: contextOptions };

    return (
      this.injector
        .inject(this.getReference(totalsContext), null)
        ?.getTotals(options) ?? of(null)
    );
  }
}
