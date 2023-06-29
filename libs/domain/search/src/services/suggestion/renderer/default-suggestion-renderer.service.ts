import { inject } from '@spryker-oryx/di';
import { SemanticLinkType } from '@spryker-oryx/site';
import { html, TemplateResult } from 'lit';
import { Observable } from 'rxjs';
import { Suggestion } from '../../../models';
import { SuggestionField } from '../../adapter';
import { SuggestionService } from '../suggestion.service';
import {
  SuggestionRenderer,
  SuggestionRendererOptions,
  SuggestionRendererRenderers,
  SuggestionRendererService,
} from './suggestion-renderer.service';

export class DefaultSuggestionRendererService
  implements SuggestionRendererService
{
  constructor(
    protected suggestionService = inject(SuggestionService),
    protected renderers = inject(
      SuggestionRenderer,
      [] as SuggestionRendererRenderers[]
    ).reduce(
      (acc, renderers) => ({ ...acc, ...renderers }),
      {} as SuggestionRendererRenderers
    )
  ) {}

  // TODO: find out another solution
  protected linkTypeMapper: Record<string, SemanticLinkType> = {
    [SuggestionField.Categories]: SemanticLinkType.Category,
    [SuggestionField.Articles]: SemanticLinkType.Article,
  };

  get(
    query: string,
    options?: SuggestionRendererOptions
  ): Observable<Suggestion | undefined> {
    return this.suggestionService.get({
      query,
      entities: Object.keys(options ?? {}),
    });
  }

  render(
    suggestions: Suggestion,
    options: SuggestionRendererOptions & Record<'query', string>
  ): TemplateResult {
    const entities = Object.keys(options);
    const data = entities.map(
      (entry) => suggestions?.[entry as keyof Suggestion]
    );

    return html`${data?.map((suggestion, index) => {
      const entity = entities[index] ?? '';
      const renderer = this.renderers[entity];
      const args = {
        query: options.query,
        title: `search.box.${entity}`,
        type: this.linkTypeMapper[entity] ?? SemanticLinkType.ProductList,
        ...options[entity as SuggestionField],
      };

      return renderer
        ? renderer(suggestion, args)
        : this.renderers.default(suggestion, args);
    })}`;
  }
}
