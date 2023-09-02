import { SuggestionEntities } from '../services';

export interface SuggestionQualifier {
  query?: string;
  type?: string;
  entities?: SuggestionEntities;
}

export interface FacetQualifier {
  name: string;
}
