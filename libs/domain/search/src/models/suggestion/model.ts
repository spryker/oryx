import { Product } from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { SuggestionField } from '../../services';

export interface SuggestionResource {
  name: string;
  url?: string;
  params?: Record<string, string>;
  id?: string;
  type?: SemanticLinkType;
}

export interface Suggestion {
  [SuggestionField.Suggestions]?: SuggestionResource[];
  [SuggestionField.Categories]?: SuggestionResource[];
  [SuggestionField.Contents]?: SuggestionResource[];
  [SuggestionField.Products]?: Product[];
}
