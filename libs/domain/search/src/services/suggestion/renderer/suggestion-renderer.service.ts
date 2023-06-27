import { TemplateResult } from 'lit';
import { Observable } from 'rxjs';
import { Suggestion } from '../../../models';
import { SuggestionEntries } from '../../adapter';

export const SuggestionRendererService = 'oryx.SuggestionRendererService';
export const SuggestionRenderer = 'oryx.SuggestionRenderer*';

export interface SuggestionRendererOptions {
  /**
   * Maximum amount of completions to show
   * @default 5
   */
  completionsCount?: number;

  /**
   * Maximum amount of products to show
   * @default 6
   */
  productsCount?: number;

  /**
   * Maximum amount of categories to show
   * @default 5
   */
  categoriesCount?: number;

  /**
   * Maximum amount of CMS links to show
   * @default 5
   */
  cmsCount?: number;

  /**
   * List of entries which should be shown
   */
  entries?: SuggestionEntries;
}

export type SuggestionRendererParams = SuggestionRendererOptions & {
  query: string;
};

export interface SuggestionRendererService {
  render(): Observable<TemplateResult | void>;
  getSuggestions<T = Suggestion>(
    query: string,
    options?: SuggestionRendererOptions
  ): Observable<T | null>;
}

export type SuggestionRenderer<T = unknown> = (
  suggestion: T | null,
  params: SuggestionRendererParams
) => TemplateResult | void;

export interface SuggestionRendererRenderers {
  default: SuggestionRenderer;
  [key: string]: SuggestionRenderer;
}

declare global {
  interface InjectionTokensContractMap {
    [SuggestionRendererService]: SuggestionRendererService;
    [SuggestionRenderer]: SuggestionRendererRenderers;
  }
}
