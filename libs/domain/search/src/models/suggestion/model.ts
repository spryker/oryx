import { Product } from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import { SuggestionField } from '../../services';

export interface SuggestionResource {
  name: string;
  url?: string;
  params?: Record<string, string>;
  id?: string;
  type?: RouteType | string;
}

export interface Suggestion {
  [SuggestionField.Suggestions]?: SuggestionResource[];
  [SuggestionField.Categories]?: SuggestionResource[];
  [SuggestionField.Contents]?: SuggestionResource[];
  [SuggestionField.Products]?: Product[];
}
