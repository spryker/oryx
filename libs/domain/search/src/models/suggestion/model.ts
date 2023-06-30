import { Product } from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { DirectiveResult } from 'lit/async-directive';
import { SuggestionField } from '../../services';

export interface SuggestionLinks {
  title?: DirectiveResult;
  options: SuggestionResource[];
  type: SemanticLinkType;
  id?: string;
}

export interface SuggestionResource {
  name: string;
  url?: string;
  params?: Record<string, string>;
  id?: string;
}

export interface Suggestion {
  [SuggestionField.Suggestions]?: SuggestionResource[];
  [SuggestionField.Categories]?: SuggestionResource[];
  [SuggestionField.Articles]?: SuggestionResource[];
  [SuggestionField.Products]?: Product[];
}
