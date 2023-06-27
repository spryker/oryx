import { Observable } from "rxjs";
import { CartQualifier, NormalizedTotals } from "../../models";

export const enum TotalsContext {
  Reference = 'reference',
}

export const TotalsService = 'oryx.TotalsService*';

export interface TotalsService {
  getTotals(qualifier?: CartQualifier): Observable<NormalizedTotals | null>;
}
