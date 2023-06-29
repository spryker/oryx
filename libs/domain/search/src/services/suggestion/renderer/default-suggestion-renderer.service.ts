import { inject } from '@spryker-oryx/di';
import { SemanticLinkType } from '@spryker-oryx/site';
import { html, TemplateResult } from 'lit';
import {
  map,
  Observable,
  ReplaySubject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
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

  protected data$ = new ReplaySubject<
    SuggestionRendererOptions & Record<'query', string>
  >(1);
  protected suggestion$ = this.data$.pipe(
    switchMap(({ query, entities }) =>
      this.suggestionService.get({ query, entities })
    )
  );

  getSuggestions<T = Suggestion>(
    query: string,
    options?: SuggestionRendererOptions
  ): Observable<T | null> {
    this.data$.next({ query, ...options });
    return this.suggestion$ as unknown as Observable<T | null>;
  }

  render(): Observable<TemplateResult | void> {
    return this.suggestion$.pipe(
      withLatestFrom(this.data$),
      map(([suggestions, options]) => {
        const data = options.entities?.map(
          (entry) => suggestions?.[entry as keyof Suggestion]
        );

        return html`${data?.map((suggestion, index) => {
          const entity = options?.entities?.[index] ?? '';
          const renderer = this.renderers[entity];
          const args = {
            query: options.query,
            title: `search.box.${entity}`,
            count: options[
              `${entity}Count` as keyof SuggestionRendererOptions
            ] as number,
            type: this.linkTypeMapper[entity] ?? SemanticLinkType.ProductList,
          };

          return options?.entities && renderer
            ? renderer(suggestion, args)
            : this.renderers.default(suggestion, args);
        })}`;
      })
    );
  }
}
