import { Observable } from 'rxjs';
import { Suggestion, SuggestionQualifier } from '../../models';

export interface SuggestionAdapter {
  getKey(qualifier: SuggestionQualifier): string;
  get(qualifier: SuggestionQualifier): Observable<Suggestion>;
}

export const SuggestionAdapter = 'FES.SuggestionAdapter';

declare global {
  interface InjectionTokensContractMap {
    [SuggestionAdapter]: SuggestionAdapter;
  }
}
