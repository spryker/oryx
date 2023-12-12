import { Observable } from 'rxjs';
import { NormalizedTotals } from '../../models';
import { LitElement } from 'lit';

export const enum TotalsContext {
  Reference = 'cart-totals',
}

export const TotalsService = 'oryx.TotalsService';
export const TotalsResolver = 'oryx.TotalsResolver*';

export interface TotalsService {
  get(context?: string, options?: TotalsResolverOptions): Observable<NormalizedTotals | null>;
}

export interface TotalsResolver {
  getTotals(options?: TotalsResolverOptions): Observable<NormalizedTotals | null>;
}

export interface TotalsResolverOptions {
  contextElement?: HTMLElement | LitElement;
}
