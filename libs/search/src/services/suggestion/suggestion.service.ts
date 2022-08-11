import { HttpErrorResponse } from '@spryker-oryx/core';
import { NullableGeneric } from '@spryker-oryx/typescript-utils';
import { Observable } from 'rxjs';
import { Suggestion, SuggestionQualifier } from '../../models';

export interface SuggestionService {
  get(qualifier: SuggestionQualifier): Observable<NullableGeneric<Suggestion>>;
  getError(
    qualifier: SuggestionQualifier
  ): Observable<NullableGeneric<HttpErrorResponse>>;
}

export const SuggestionService = 'FES.SuggestionService';

declare global {
  interface InjectionTokensContractMap {
    [SuggestionService]: SuggestionService;
  }
}
