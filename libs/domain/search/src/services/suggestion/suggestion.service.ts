import { QueryState } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { Suggestion, SuggestionQualifier } from '../../models';

export interface SuggestionService {
  get<T = Suggestion>(
    qualifier: SuggestionQualifier
  ): Observable<T | undefined>;
  getState(qualifier: SuggestionQualifier): Observable<QueryState<Suggestion>>;
}

export const SuggestionService = 'oryx.SuggestionService';

declare global {
  interface InjectionTokensContractMap {
    [SuggestionService]: SuggestionService;
  }
}
