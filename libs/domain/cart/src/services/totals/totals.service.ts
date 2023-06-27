import { Observable } from 'rxjs';
import { NormalizedTotals } from '../../models';

export const enum TotalsContext {
  Reference = 'reference',
}

export interface TotalsContextData extends Record<string, any> {
  context: string;
}

export const TotalsService = 'oryx.TotalsService*';

export interface TotalsService {
  getTotals(qualifier?: unknown): Observable<NormalizedTotals | null>;
}
