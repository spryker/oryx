import { Adapter } from '@spryker-oryx/core';
import { Suggestion, SuggestionQualifier } from '../../models';

export type SuggestionAdapter = Adapter<Suggestion, SuggestionQualifier>;

export const SuggestionAdapter = 'FES.SuggestionAdapter';

declare global {
  interface InjectionTokensContractMap {
    [SuggestionAdapter]: SuggestionAdapter;
  }
}
