import { inject } from '@spryker-oryx/di';
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
    const data = Object.keys(options)
      .map((entity) => {
        const records = suggestions?.[entity as keyof Suggestion];

        if (records) {
          return {
            records,
            entity,
          };
        }

        return null;
      })
      .filter(Boolean);

    return html`${data?.map((suggestion) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { entity, records } = suggestion!;
      const renderer = this.renderers[entity];
      const args = {
        query: options.query,
        title: `search.box.${entity}`,
        ...options[entity as SuggestionField],
      };

      return renderer
        ? renderer(records, args)
        : this.renderers.default(records, args);
    })}`;
  }
}
