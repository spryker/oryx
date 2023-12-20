import { LitElement } from 'lit';
import { Observable } from 'rxjs';
import { NormalizedTotals } from '../../models';

export const enum TotalsContext {
  Reference = 'cart-totals',
}

export const TotalsService = 'oryx.TotalsService';
export const TotalsResolver = 'oryx.TotalsResolver*';

export interface TotalsService {
  /** @deprecated since 1.4. Use set of options instead */
  get(context?: string): Observable<NormalizedTotals | null>;
  get(options: TotalsOptions): Observable<NormalizedTotals | null>;
}

export interface TotalsResolver {
  getTotals(
    options?: TotalsResolverOptions
  ): Observable<NormalizedTotals | null>;
}

export interface TotalsOptions extends TotalsResolverOptions {
  /**
   * Type of the totals context that is used to define the data resolver
   */
  context?: string;
}

export interface TotalsResolverOptions {
  /**
   * Html or Lit element that is used as context provider
   */
  element?: HTMLElement | LitElement;
}
