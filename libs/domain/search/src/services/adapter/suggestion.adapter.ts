import { Observable } from 'rxjs';
import { Suggestion, SuggestionQualifier } from '../../models';

export const enum SuggestionField {
  Suggestions = 'suggestions',
  Categories = 'categories',
  Products = 'products',
  Articles = 'articles',
}

export type SuggestionEntities = (SuggestionField | string)[];

export interface SuggestionAdapter {
  getKey(qualifier: SuggestionQualifier): string;
  get(qualifier: SuggestionQualifier): Observable<Suggestion>;
}

export const SuggestionAdapter = 'oryx.SuggestionAdapter*';

declare global {
  interface InjectionTokensContractMap {
    [SuggestionAdapter]: SuggestionAdapter;
  }
}
