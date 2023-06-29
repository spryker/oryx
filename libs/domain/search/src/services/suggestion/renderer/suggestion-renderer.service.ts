import { SemanticLinkType } from '@spryker-oryx/site';
import { TemplateResult } from 'lit';
import { Observable } from 'rxjs';
import { Suggestion } from '../../../models';
import { SuggestionEntities, SuggestionField } from '../../adapter';

export const SuggestionRendererService = 'oryx.SuggestionRendererService';
export const SuggestionRenderer = 'oryx.SuggestionRenderer*';

export interface SuggestionFieldOptions {
  /**
   * Maximum amount of suggestion entities to show
   */
  max?: number;
}

type SuggestionFieldOptionsMapper = {
  [P in SuggestionField]?: SuggestionFieldOptions;
};

export interface SuggestionRendererOptions
  extends SuggestionFieldOptionsMapper {
  /**
   * List of entities which should be shown
   */
  entities?: SuggestionEntities;
}

export interface SuggestionRendererParams extends SuggestionFieldOptions {
  query: string;
  title: string;
  type: SemanticLinkType;
}

export interface SuggestionRendererService {
  render(
    suggestions: Suggestion,
    options: SuggestionRendererOptions & Record<'query', string>
  ): TemplateResult;
  get(
    query: string,
    entities?: SuggestionEntities
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
