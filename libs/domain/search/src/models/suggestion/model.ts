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

export interface SuggestionResponse {
  completion?: string[];
  categories?: SuggestionResource[];
  cmsPages?: SuggestionResource[];
  products?: Product[];
}

export interface Suggestion {
  cmsPages: any;
  completion?: SuggestionLinks[];
  categories?: SuggestionLinks[];
  products?: Product[];
}
