import { Product } from '@spryker-oryx/product';

export interface SuggestionResource {
  name: string;
  url: string;
}

export interface Suggestion {
  completion: string[];
  categories: SuggestionResource[];
  cmsPages: SuggestionResource[];
  products: Product[];
}
