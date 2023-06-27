import { SuggestionEntries } from '../services';

export interface SuggestionQualifier {
  query?: string;
  entries?: SuggestionEntries;
}

export interface FacetQualifier {
  name: string;
}
