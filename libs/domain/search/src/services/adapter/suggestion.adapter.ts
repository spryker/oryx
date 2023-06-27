import { Observable } from 'rxjs';
import { SuggestionQualifier, SuggestionResponse } from '../../models';

export const enum SuggestionField {
  Completion = 'completion',
  Categories = 'categories',
  Products = 'products',
}

export type SuggestionEntries = (SuggestionField | string)[];

export interface SuggestionAdapter {
  getKey(qualifier: SuggestionQualifier): string;
  get(qualifier: SuggestionQualifier): Observable<SuggestionResponse>;
}

export const SuggestionAdapter = 'oryx.SuggestionAdapter*';

declare global {
  interface InjectionTokensContractMap {
    [SuggestionAdapter]: SuggestionAdapter;
  }
}
