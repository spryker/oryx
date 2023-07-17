import { Product } from '@spryker-oryx/product';
import { DirectiveResult } from 'lit/async-directive';
import { SuggestionField } from '../../services';
import { RouteLinkType } from '@spryker-oryx/router/lit';

export interface SuggestionLinks {
  title?: DirectiveResult;
  options: SuggestionResource[];
  type: RouteLinkType | string;
  id?: string;
}

export interface SuggestionResource {
  name: string;
  url?: string;
  params?: Record<string, string>;
  id?: string;
  type?: RouteLinkType | string;
}

export interface Suggestion {
  [SuggestionField.Suggestions]?: SuggestionResource[];
  [SuggestionField.Categories]?: SuggestionResource[];
  [SuggestionField.Contents]?: SuggestionResource[];
  [SuggestionField.Products]?: Product[];
}
