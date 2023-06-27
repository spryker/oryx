import { Observable } from 'rxjs';
import { Suggestion, SuggestionLinks } from '../../../models';
import { SuggestionRendererParams } from '../renderer';

export const SuggestionRevealer = 'oryx.SuggestionRevealer*';

export interface SuggestionRevealer {
  reveal<T = Suggestion | SuggestionLinks>(
    params: SuggestionRendererParams
  ): Observable<T | null>;
}

declare global {
  interface InjectionTokensContractMap {
    [SuggestionRevealer]: SuggestionRevealer;
  }
}
