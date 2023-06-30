import { SemanticLinkType } from '@spryker-oryx/site';
import { TemplateResult } from 'lit';
import { Observable } from 'rxjs';
import { Suggestion } from '../../../models';
import { SuggestionField } from '../../adapter';

export const SuggestionRendererService = 'oryx.SuggestionRendererService';
export const SuggestionRenderer = 'oryx.SuggestionRenderer*';

export interface SuggestionFieldOptions {
  /**
   * Maximum amount of suggestion entities to show
   */
  max?: number;

  icon?: string;
}

export type SuggestionRendererOptions = {
  [P in SuggestionField]?: SuggestionFieldOptions;
};

export interface SuggestionRendererParams extends SuggestionFieldOptions {
  query: string;
  title: string;
  icon?: string;
  type: SemanticLinkType;
}

export interface SuggestionRendererService {
  render(
    suggestions: Suggestion,
    options: SuggestionRendererOptions & Record<'query', string>
  ): TemplateResult;
  get(
    query: string,
    options?: SuggestionRendererOptions
  ): Observable<Suggestion | undefined>;
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
