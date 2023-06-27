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
import { Suggestion } from '../../../models';
import { SuggestionRevealer } from '../revealer';
import {
  SuggestionRenderer,
  SuggestionRendererOptions,
  SuggestionRendererParams,
  SuggestionRendererRenderers,
  SuggestionRendererService,
} from './suggestion-renderer.service';

export class DefaultSuggestionRendererService
  implements SuggestionRendererService
{
  constructor(
    protected revealers = inject(SuggestionRevealer, []),
    protected renderers = inject(
      SuggestionRenderer,
      [] as SuggestionRendererRenderers[]
    ).reduce(
      (acc, renderers) => ({ ...acc, ...renderers }),
      {} as SuggestionRendererRenderers
    )
  ) {}

  protected data$ = new ReplaySubject<SuggestionRendererParams>(1);
  protected suggestion$ = this.data$.pipe(
    switchMap((query) =>
      combineLatest(this.revealers.map((revealer) => revealer.reveal(query)))
    ),
    map((suggestions) =>
      suggestions.reduce(
        (acc, suggestion) => (suggestion ? { ...suggestion, ...acc } : acc),
        Object.create(null)
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

  render(): Observable<TemplateResult | void> {
    return this.suggestion$.pipe(
      withLatestFrom(this.data$),
      map(([suggestions, options]) => {
        const data = options.entries?.map((entry) => suggestions[entry]);

        return html` ${data?.map((suggestion, index) => {
          const renderer = this.renderers[options?.entries?.[index] ?? ''];

          return options?.entries && renderer
            ? renderer(suggestion, options)
            : this.renderers.default(suggestion, options);
        })}`;
      })
    );
  }
}
