import { SuggestionEntities } from '../services';

export interface SuggestionQualifier {
  query?: string;
  entities?: SuggestionEntities;
}

export interface FacetQualifier {
  name: string;
}
