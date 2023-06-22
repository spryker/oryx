import { SemanticLinkType } from '@spryker-oryx/site';
import { TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/async-directive';
import { Observable } from 'rxjs';
import { Suggestion, SuggestionResource } from '../../models';

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
}

export interface LinksSection {
  title?: DirectiveResult;
  options: SuggestionResource[];
  type: SemanticLinkType;
}

export interface SuggestionRendererService {
  render(): Observable<TemplateResult | undefined>;
  getSuggestions<T = Suggestion>(
    query: string,
    options?: SuggestionRendererOptions
  ): Observable<T | null>;
}

export interface SuggestionRenderer {
  render?(suggestion: Suggestion | null, query?: string): TemplateResult | void;
  getSuggestions<T = Suggestion>(
    data: SuggestionRendererOptions & { query: string }
  ): Observable<T | null>;
}

declare global {
  interface InjectionTokensContractMap {
    [SuggestionRendererService]: SuggestionRendererService;
    [SuggestionRenderer]: SuggestionRenderer;
  }
}
