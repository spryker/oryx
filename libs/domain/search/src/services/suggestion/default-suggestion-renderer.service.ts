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
  protected suggestion$ = this.data$.pipe(
    switchMap((query) =>
      combineLatest(
        this.renderers.map((renderer) => renderer.getSuggestions(query))
      ).pipe(
        map((suggestions) => {
          console.log(suggestions, 'suggestions');
          return suggestions.reduce(
            (acc, suggestion) => (suggestion ? { ...suggestion, ...acc } : acc),
            null
          );
        })
      )
    )
  );

  getSuggestions<T = Suggestion>(
    query: string,
    options?: SuggestionRendererOptions
  ): Observable<T | null> {
    this.data$.next({ query, ...options });
    return this.suggestion$ as unknown as Observable<T | null>;
  }

  render(): Observable<TemplateResult | undefined> {
    return this.suggestion$.pipe(
      withLatestFrom(this.data$),
      map(
        ([suggestion, { query }]) =>
          html`${this.renderers.map((renderer) =>
            renderer.render?.(suggestion, query)
          )}`
      )
    );
  }
}
