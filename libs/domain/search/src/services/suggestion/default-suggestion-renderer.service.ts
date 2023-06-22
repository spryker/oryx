import { inject } from '@spryker-oryx/di';
import { html, TemplateResult } from 'lit';
import {
  combineLatest,
  map,
  Observable,
  ReplaySubject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { Suggestion } from '../../models';
import {
  LinksSection,
  SuggestionRenderer,
  SuggestionRendererOptions,
  SuggestionRendererService,
} from './suggestion-renderer.service';

export class DefaultSuggestionRendererService
  implements SuggestionRendererService
{
  constructor(protected renderers = inject(SuggestionRenderer)) {}

  protected data$ = new ReplaySubject<
    SuggestionRendererOptions & { query: string }
  >(1);
  protected suggestions$ = this.data$.pipe(
    switchMap((query) =>
      combineLatest(
        this.renderers.map((renderer) => renderer.getSuggestions(query))
      )
    )
  );
  protected suggestion$ = this.suggestions$.pipe(
    map((suggestions) => {
      console.log(suggestions, 'suggestions');
      return suggestions.reduce(
        (acc, suggestion) => (suggestion ? { ...suggestion, ...acc } : acc),
        null
      );
    })
  );

  getSuggestions<T = Suggestion>(
    query: string,
    options?: SuggestionRendererOptions
  ): Observable<T | null> {
    this.data$.next({ query, ...options });
    return this.suggestion$ as unknown as Observable<T | null>;
  }

  render(): Observable<TemplateResult | undefined> {
    return this.suggestions$.pipe(
      withLatestFrom(this.data$),
      map(([suggestions, { query }]) => {
        console.log(suggestions, 'suggestions');
        return html`${this.renderers.map(
          (renderer, index) =>
            renderer.render?.(suggestions[index], query) ??
            this.renderLinks(suggestions[index] as LinksSection)
        )}`;
      })
    );
  }

  protected renderLinks(link?: LinksSection): TemplateResult | void {
    if (!link) {
      return;
    }

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
