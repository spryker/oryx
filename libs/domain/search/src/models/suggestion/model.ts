import { Product } from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { DirectiveResult } from 'lit/async-directive';

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
  idCategory?: string;
}

export interface Suggestion {
  suggestions?: SuggestionResource[];
  categories?: SuggestionResource[];
  products?: Product[];
}
