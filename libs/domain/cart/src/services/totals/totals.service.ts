import { Observable } from 'rxjs';
import { NormalizedTotals } from '../../models';

export const enum TotalsContext {
  Reference = 'reference',
}

export const TotalsService = 'oryx.TotalsService';
export const TotalsServiceProvider = 'oryx.TotalsService*';

export interface TotalsService {
  get(context?: string): Observable<NormalizedTotals | null>;
}

export interface TotalsServiceProvider {
  getTotals(): Observable<NormalizedTotals | null>;
}
