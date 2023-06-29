import { SemanticLinkType } from '@spryker-oryx/site';
import { TemplateResult } from 'lit';
import { Observable } from 'rxjs';
import { Suggestion } from '../../../models';
import { SuggestionEntities, SuggestionField } from '../../adapter';

export const SuggestionRendererService = 'oryx.SuggestionRendererService';
export const SuggestionRenderer = 'oryx.SuggestionRenderer*';

type Counts = {
  /**
   * Maximum amount of suggestion entities to show
   */
  [P in SuggestionField as `${P}Count`]?: number;
};

export interface SuggestionRendererOptions extends Counts {
  /**
   * List of entries which should be shown
   */
  entities?: SuggestionEntities;
}

export interface SuggestionRendererParams {
  query: string;
  title: string;
  count?: number;
  type: SemanticLinkType;
}

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
