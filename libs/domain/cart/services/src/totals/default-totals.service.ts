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

  /** @deprecated since 1.4. Use set of options instead */
  get(context?: string): Observable<NormalizedTotals | null>;
  get(contextOptions?: TotalsOptions): Observable<NormalizedTotals | null>;
  get(
    contextOptions?: TotalsOptions | string
  ): Observable<NormalizedTotals | null> {
    const { context, ...options } =
      typeof contextOptions === 'object'
        ? contextOptions
        : { context: contextOptions };

    return (
      this.injector
        .inject(this.getReference(context), null)
        ?.getTotals(options) ?? of(null)
    );
  }
}
