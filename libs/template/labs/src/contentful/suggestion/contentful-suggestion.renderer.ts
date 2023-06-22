import { inject } from '@spryker-oryx/di';
import {
  LinksSection,
  Suggestion,
  SuggestionRenderer,
  SuggestionRendererOptions,
} from '@spryker-oryx/search';
import { SemanticLinkType } from '@spryker-oryx/site';
import { i18n } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { map, Observable } from 'rxjs';

import { ContentfulSuggestionService } from './contentful-suggestion.service';

export class ContentfulSuggestionRenderer implements SuggestionRenderer {
  constructor(
    protected suggestionService = inject(ContentfulSuggestionService)
  ) {}

  getSuggestions<T = Suggestion>(
    data: SuggestionRendererOptions & { query: string }
  ): Observable<T | null> {
    const { query, ...options } = data;
    console.log(options.cmsCount);
    return this.suggestionService
      .get({
        query,
      })
      .pipe(
        map((entries) => ({
          contentful: {
            title: i18n('search.box.content'),
            options: entries?.cmsPages
              ?.slice(0, options.cmsCount)
              ?.map((entry) => ({
                name: entry.name,
                url: entry.name,
              })),
            type: SemanticLinkType.Article,
          },
        }))
      ) as unknown as Observable<T | null>;
  }

  render(suggestion: Suggestion | null): TemplateResult | void {
    if (!(suggestion as any)?.contentful.options.length) {
      return;
    }

    return this.renderLink((suggestion as any).contentful);
  }

  protected renderLink(link: LinksSection): TemplateResult {
    const { title, options, type } = link;

    if (!options.length) {
      return html``;
    }

    return html`
      <section>
        <h5>${title}</h5>
        <ul>
          ${options.map(
            ({ name, url, params }) => html`
              <li>
                <oryx-content-link
                  .options=${{
                    type,
                    id: url ?? '',
                    params: params ?? null,
                    text: name,
                  }}
                  close-popover
                ></oryx-content-link>
              </li>
            `
          )}
        </ul>
      </section>
    `;
  }
}
