import { LitElement } from 'lit';
import { Observable } from 'rxjs';
import { NormalizedTotals } from '../../models';

export const enum TotalsContext {
  Reference = 'cart-totals',
}

export const TotalsService = 'oryx.TotalsService';
export const TotalsResolver = 'oryx.TotalsResolver*';

export interface TotalsService {
  get(context?: string): Observable<NormalizedTotals | null>;
  get(options: TotalsOptions): Observable<NormalizedTotals | null>;
}

export interface TotalsResolver {
  getTotals(
    options?: TotalsResolverOptions
  ): Observable<NormalizedTotals | null>;
}

export interface TotalsOptions extends TotalsResolverOptions {
  totalsContext?: string;
}

export interface TotalsResolverOptions {
  contextElement?: HTMLElement | LitElement;
}
