import { QueryState } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { SuggestionQualifier, SuggestionResponse } from '../../models';

export interface SuggestionService {
  get<T = SuggestionResponse>(
    qualifier: SuggestionQualifier
  ): Observable<T | undefined>;
  getState(
    qualifier: SuggestionQualifier
  ): Observable<QueryState<SuggestionResponse>>;
}

export const SuggestionService = 'oryx.SuggestionService';

declare global {
  interface InjectionTokensContractMap {
    [SuggestionService]: SuggestionService;
  }
}
